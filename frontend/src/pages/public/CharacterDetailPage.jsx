
import { useParams } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase.js'
import favoritesService from '../../services/favoritesService'
import characterService from '../../services/characterService'
import { getPublicUrl, STORAGE_BUCKETS, getFileExtension } from '../../lib/storage'

import '../../assets/styles/home.css'
import '../../assets/styles/individualCharacter.css'

function CharacterDetailPage() {
  const { slug } = useParams()

  const [character, setCharacter] = useState(null)
  const [filmography, setFilmography] = useState([])
  const [actors, setActors] = useState([])
  const [relatedImages, setRelatedImages] = useState([])

  const [isFavorite, setIsFavorite] = useState(false)

  const [loadingCharacter, setLoadingCharacter] = useState(true)
  const [loadingFavorite, setLoadingFavorite] = useState(false)

  const fileInputRef = useRef(null)
  const [uploadDescription, setUploadDescription] = useState('')
  const [communityPhotos, setCommunityPhotos] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const [loadingComment, setLoadingComment] = useState(false)
  const [loadingCommunityPhoto, setLoadingCommunityPhoto] = useState(false)

  const [currentUser, setCurrentUser] = useState(null)

  const [audios, setAudios] = useState([])
  const [openTranscriptId, setOpenTranscriptId] = useState(null)
  const [personalityTags, setPersonalityTags] = useState([])

  const [zoomedImage, setZoomedImage] = useState(null)

  function formatTranscription(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s+/g, '$1\n\n')
    .trim()
}

  function getFileType(path) {
    if (!path) return 'other'
    const ext = path.split('.').pop().split('?')[0].toLowerCase()
    if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) return 'image'
    if (['mp4','webm','ogg','mov','avi','mkv'].includes(ext)) return 'video'
    if (['pdf'].includes(ext)) return 'pdf'
    if (['mp3','wav','aac','flac','m4a'].includes(ext)) return 'audio'
    return 'other'
  }

  function getFileIcon(path) {
    if (!path) return 'bi-file-earmark'
    const ext = path.split('.').pop().split('?')[0].toLowerCase()
    if (['doc','docx'].includes(ext)) return 'bi-file-earmark-word'
    if (['xls','xlsx'].includes(ext)) return 'bi-file-earmark-excel'
    if (['ppt','pptx'].includes(ext)) return 'bi-file-earmark-ppt'
    if (['zip','rar','7z','tar','gz'].includes(ext)) return 'bi-file-earmark-zip'
    return 'bi-file-earmark'
  }

useEffect(() => {
  const loadCharacter = async () => {
    setLoadingCharacter(true)

    try {
      const { data: authData } = await supabase.auth.getUser()
      const currentUser = authData?.user ?? null
      const currentUserId = currentUser?.id ?? null

      setCurrentUser(currentUser)

      const characterData = await characterService.getDetailBySlug(slug)

      if (!characterData) {
        setCharacter(null)
        return
      }

      const characterId = characterData.id
      setCharacter(characterData)

      if (currentUserId) {
        try {
          const favoriteStatus = await favoritesService.isFavorite(characterId)
          setIsFavorite(favoriteStatus)
        } catch (error) {
          console.error('Error cargando favorito:', error.message)
          setIsFavorite(false)
        }
      } else {
        setIsFavorite(false)
      }

      try {
        const data = await characterService.getFilmography(characterId)
        setFilmography(data)
      } catch (error) {
        console.error('Error cargando filmografía:', error.message)
        setFilmography([])
      }

      try {
        const data = await characterService.getActors(characterId)
        setActors(data)
      } catch (error) {
        console.error('Error cargando actores:', error.message)
        setActors([])
      }

      try {
        const data = await characterService.getPersonalityTags(characterId)
        setPersonalityTags(data)
      } catch (error) {
        console.error('Error cargando tags de personalidad:', error.message)
        setPersonalityTags([])
      }

      try {
        const data = await characterService.getImages(characterId, characterData.name)
        setRelatedImages(data)
      } catch (error) {
        console.error('Error cargando imágenes relacionadas:', error.message)
        setRelatedImages([])
      }

      try {
        const data = await characterService.getAudios(characterId)
        setAudios(data)
      } catch (error) {
        console.error('Error cargando audios:', error.message)
        setAudios([])
      }

      try {
        const data = await characterService.getCommunityPhotos(characterId)
        setCommunityPhotos(data)
      } catch (error) {
        console.error('Error cargando fotos comunidad:', error.message)
        setCommunityPhotos([])
      }

      try {
        const data = await characterService.getComments(characterId, currentUserId)
        setComments(data)
      } catch (error) {
        console.error('Error cargando comentarios:', error.message)
        setComments([])
      }

    } catch (error) {
      console.error('Error cargando personaje:', error.message)
      setCharacter(null)
    } finally {
      setLoadingCharacter(false)
    }
  }

  loadCharacter()
}, [slug])

  const handlePublishComment = async () => {
    try {
      if (!newComment.trim()) {
        alert('Escribe un comentario antes de publicar')
        return
      }

      if (!character) return

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const user = authData?.user
      if (!user) {
        alert('Debes iniciar sesión para comentar')
        return
      }

      setLoadingComment(true)

      const { data, error } = await supabase
        .from('comments')
        .insert({
          character_id: character.id,
          user_id: user.id,
          comment: newComment.trim(),
        })
        .select(`
          id,
          comment,
          created_at
        `)
        .single()

      if (error) throw error

      const avatarUrl = authData?.user?.user_metadata?.avatar_path
      ? getPublicUrl(STORAGE_BUCKETS.avatars, authData.user.user_metadata.avatar_path)
      : null
      
      const newFormattedComment = {
        id: data.id,
        user: 'Tú',
        userId: user.id,
        avatar: avatarUrl,
        time: new Date(data.created_at).toLocaleDateString('es-ES'),
        text: data.comment,
      }

      setComments((prev) => [newFormattedComment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Error publicando comentario:', error.message)
      alert('No se pudo publicar el comentario')
    } finally {
      setLoadingComment(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      if (!window.confirm('¿Eliminar este comentario?')) return

      setLoadingComment(true)

      await characterService.deleteComment(commentId)

      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (error) {
      console.error('Error eliminando comentario:', error.message)
    } finally {
      setLoadingComment(false)
    }
  }

  const handleUploadImage = async (event) => {
    try {
      const file = event.target.files[0]

      if (!file) return

      if (!character) return

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const user = authData?.user

      if (!user) {
        alert('Debes iniciar sesión para subir un archivo')
        return
      }

      setLoadingCommunityPhoto(true)

      // nombre único y sanitizado (sin espacios ni caracteres especiales)
      const safeName = file.name
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar acentos
        .replace(/[^a-zA-Z0-9._-]/g, '_')                 // reemplazar caracteres no permitidos
      const fileName = `${Date.now()}-${safeName}`

      const defaultDescription = (() => {
        const t = getFileType(fileName)
        if (t === 'image') return 'Imagen de la comunidad'
        if (t === 'video') return 'Vídeo de la comunidad'
        if (t === 'pdf') return 'PDF de la comunidad'
        if (t === 'audio') return 'Audio de la comunidad'
        return 'Archivo de la comunidad'
      })()

      // 1) subir archivo al bucket gallery
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file, { contentType: file.type })

      if (uploadError) throw uploadError

      // 2) guardar registro en la tabla community_photos
      const { data, error: insertError } = await supabase
        .from('community_photos')
        .insert({
          character_id: character.id,
          user_id: user.id,
          image_path: fileName,
          description: uploadDescription || defaultDescription,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // 3) añadir la nueva foto a la galería en pantalla
      const newPhoto = {
        id: data.id,
        description: data.description || defaultDescription,
        image: getPublicUrl(STORAGE_BUCKETS.gallery, data.image_path) || null,
        imagePath: data.image_path,
        user: user.user_metadata?.username || user.email || 'Tú',
        date: new Date().toLocaleDateString('es-ES'),
      }

      setCommunityPhotos((prev) => [newPhoto, ...prev])
      setUploadDescription('')

      // limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      alert('Archivo subido correctamente')
    } catch (error) {
      console.error('Error subiendo archivo:', error.message, error)
      alert(`No se pudo subir el archivo: ${error.message}`)
    } finally {
      setLoadingCommunityPhoto(false)
    }
  }

  const handleFavorite = async () => {
    if (!character) return

    try {
      setLoadingFavorite(true)

      if (isFavorite) {
        await favoritesService.removeFavorite(character.id)
        setIsFavorite(false)
      } else {
        await favoritesService.addFavorite(character.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error actualizando favorito:', error.message)
      alert('Debes iniciar sesión o hubo un error al actualizar favoritos')
    } finally {
      setLoadingFavorite(false)
    }
  }

  async function downloadStorageFile(bucket, path, filename) {
    try{
      const { data, error } = await supabase.storage.from(bucket).download(path)

      if(error) throw error

      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'archivo'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch(error) {
      console.error('Error descargando archivo: ', error.message)
      alert('Error al descargar el archivo')
    }
  }

  if (loadingCharacter) {
    return (
      <main className="character-detail-page">
        <h1>Cargando personaje...</h1>
      </main>
    )
  }

  if (!character) {
    return (
      <main className="character-detail-page">
        <h1>Personaje no encontrado</h1>
      </main>
    )
  }

  return (
    <main className="character-detail-page">
      <div className="cardPersonajeIndividual">
        {character.image && (
          <img
            src={character.image}
            className="card-img-top"
            alt={character.name}
            style={{ cursor: 'zoom-in' }}
            onClick={() => setZoomedImage({ url: character.image, label: character.name })}
          />
        )}

        <div className="card-body">
          <div className="card-header mb-3">
            <h1 className="card-title">{character.name}</h1>

            <i
              className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} favorite-icon ${!currentUser ? 'disabled' : ''}`}
              onClick={currentUser && !loadingFavorite ? handleFavorite : undefined}
              style={{
                cursor: !currentUser || loadingFavorite ? 'not-allowed' : 'pointer',
                opacity: !currentUser || loadingFavorite ? 0.6 : 1,
              }}
              title={!currentUser ? 'Inicia sesión para añadir a favoritos' : 'Añadir a favoritos'}
            ></i>
          </div>

          <h3 className="card-subtitle mb-2">
            <strong>Universo: </strong>{character.universe}
          </h3>
          <h3 className="card-subtitle mb-2">
            <strong>Carácter: </strong>{personalityTags.length > 0 ? personalityTags.map(tag => tag.name).join(', ') : '—'}
          </h3>

          <section className="auxiliar mt-5 mb-3">
            <div className="etiquetaMBTI text-center mb-2">
              <span className="tituloMBTI">Personalidad</span>
              <span className="mbti">{character.mbti} </span>
              <span className="mbtiTitle">{character.mbtiTitle}</span>
            </div>
          </section>

          <section className="history mb-3">
            <div className="historyParts mb-2">
              <i
                className="bi bi-feather featherIcon"
                style={{ color: 'var(--colorTexto)', fontSize: '1.8rem' }}
              ></i>
              <h3 className="historyTitle">Historia:</h3>
            </div>

            <p className="card-text">{character.story || 'Sin historia disponible.'}</p>

            <div className="historyParts mb-2">
              <h4 className="hitoCreacion">Hito de creación:</h4>
              <p className="card-text">{character.creationDate || '—'}</p>
            </div>

            <div className="historyParts mb-2">
              <h4 className="procedencia">Procedencia:</h4>
              <p className="card-text">{character.procedence || '—'}</p>
            </div>

            <div className="historyParts mb-2">
              <h4 className="origenBiologico">Origen biológico:</h4>
              <p className="card-text">{character.biologicalOrigin || '—'}</p>
            </div>

            <div className="historyParts mb-2">
              <h4 className="procedencia">Primera aparición:</h4>
              <p className="card-text">{character.firstAppearance || '—'}</p>
            </div>
          </section>

          <hr className="divider-thick mb-3" />

          <section className="filmography mb-4">
            <div className="d-flex justify-content-between align-items-end mb-3 px-2">
              <h3 className="filmographyTitle m-0">Filmografía:</h3>
            </div>

            <div
              className="d-flex flex-nowrap overflow-x-auto gap-3 py-3 px-2 filmography-slider"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filmography.length > 0 ? (
                filmography.map((movie) => (
                  <div
                    key={movie.id}
                    className="card border-0 flex-shrink-0 filmography-card"
                    style={{
                      width: '240px',
                      backgroundColor: 'var(--color-principal)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="related-image-item">
                      <img
                        src={movie.image}
                        alt={movie.title}
                        className="card-img-top p-3 filmography-card-img"
                        style={{
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '20px',
                        }}
                      />
                      <button
                        type="button"
                        className="download-btn"
                        disabled={!movie.coverPath}
                        onClick={() =>
                          downloadStorageFile(
                            'films-cover',
                            movie.coverPath,
                            `${movie.title}.${getFileExtension(movie.coverPath)}`
                          )
                        }
                      >
                        <i className="bi bi-download"></i>
                      </button>
                    </div>

                    <div className="card-body d-flex flex-column pt-0">
                      <span
                        className="align-self-start mb-2 px-2 py-1 rounded-1"
                        style={{
                          backgroundColor: 'var(--color5)',
                          color: 'var(--color-principal)',
                          fontFamily: 'var(--texto-normal)',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {movie.year || '—'}
                      </span>

                      <h4
                        className="card-title m-0 filmTitle"
                        style={{
                          color: 'var(--color3)',
                          fontFamily: 'var(--texto-normal)',
                        }}
                      >
                        {movie.title}
                      </h4>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay filmografía disponible.</p>
              )}
            </div>
          </section>

          <section className="accordion btmAccordion" id="acordeonPersonaje">
            <div className="accordion-item mb-3 bg-transparent border-0 btm-accordion-item">
              <h2 className="accordion-header" id="headingActores">
                <button
                  className="accordion-button collapsed btm-accordion-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseActores"
                  aria-expanded="false"
                  aria-controls="collapseActores"
                >
                  Actores/as que lo han interpretado:
                </button>
              </h2>

              <div
                id="collapseActores"
                className="accordion-collapse collapse"
                aria-labelledby="headingActores"
                data-bs-parent="#acordeonPersonaje"
              >
                <div className="accordion-body custom-acordeon-body btm-accordion-body">
                  {actors.length > 0 ? (
                    <ul className="actor-list">
                      {actors.map((actor) => (
                        <li key={actor.id}>{actor.text}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay actores registrados.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="accordion-item mb-3 bg-transparent border-0 btm-accordion-item">
              <h2 className="accordion-header" id="headingMBTI">
                <button
                  className="accordion-button collapsed btm-accordion-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseMBTI"
                  aria-expanded="false"
                  aria-controls="collapseMBTI"
                >
                  Análisis de Personalidad (MBTI)
                </button>
              </h2>

              <div
                id="collapseMBTI"
                className="accordion-collapse collapse"
                aria-labelledby="headingMBTI"
                data-bs-parent="#acordeonPersonaje"
              >
                <div className="accordion-body custom-acordeon-body btm-accordion-body">
                  {character.psicologicalAnalisis || 'No hay análisis disponible.'}
                </div>
              </div>
            </div>

            <div className="accordion-item mb-3 bg-transparent border-0 btm-accordion-item">
              <h2 className="accordion-header" id="headingImgs">
                <button
                  className="accordion-button collapsed btm-accordion-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseImgs"
                  aria-expanded="false"
                  aria-controls="collapseImgs"
                >
                  Imágenes relacionadas
                </button>
              </h2>

              <div
                id="collapseImgs"
                className="accordion-collapse collapse"
                aria-labelledby="headingImgs"
                data-bs-parent="#acordeonPersonaje"
              >
                <div className="accordion-body custom-acordeon-body btm-accordion-body">
                  <div className="related-images-grid">
                    {relatedImages.length > 0 ? (
                      relatedImages.map((img) => (
                        <div key={img.id} className="related-image-item">
                          <img
                            src={img.image}
                            alt={img.title}
                            className="related-image"
                            style={{ cursor: 'zoom-in' }}
                            onClick={() => setZoomedImage({ url: img.image, label: img.title })}
                          />
                          <button
                            type="button"
                            className="download-btn"
                            disabled={!img.filePath}
                            onClick={() =>
                              downloadStorageFile(
                                'character-media',
                                img.filePath,
                                `${img.title}.${getFileExtension(img.filePath)}`
                              )
                            }
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        </div>
                      ))
                    ) : (
                      <p>No hay imágenes relacionadas.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item mb-3 bg-transparent border-0 btm-accordion-item">
              <h2 className="accordion-header" id="headingAudio">
                <button
                  className="accordion-button collapsed btm-accordion-btn"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseAudio"
                  aria-expanded="false"
                  aria-controls="collapseAudio"
                >
                  Bandas sonoras y audios relacionados
                </button>
              </h2>

              <div
                id="collapseAudio"
                className="accordion-collapse collapse"
                aria-labelledby="headingAudio"
                data-bs-parent="#acordeonPersonaje"
              >
                <div className="accordion-body custom-acordeon-body btm-accordion-body">
                  {audios.length > 0 ? (
                    <div className="audio-list">
                      {audios.map((audio) => (
                        <div key={audio.id} className="audio-item">
                          <div className="audio-item-header">
                            <div>
                              <h4 className="audio-title mb-1">{audio.title}</h4>
                              <p className="audio-type mb-2">
                                {audio.type === 'song' ? 'Canción' : 'Banda sonora'}
                              </p>
                            </div>

                            <button
                              type="button"
                              className="audio-transcript-btn"
                              onClick={() =>
                                setOpenTranscriptId((prev) => (prev === audio.id ? null : audio.id))
                              }
                            >
                              {openTranscriptId === audio.id ? 'Ocultar transcripción' : 'Ver transcripción'}
                            </button>
                          </div>

                          <audio controls className="character-audio-player">
                            <source src={audio.url} type="audio/mpeg" />
                            Tu navegador no soporta audio HTML5.
                          </audio>

                          {openTranscriptId === audio.id && (
                            <div className="audio-transcript-box">
                              <div className="audio-transcript-content">
                                {audio.transcription?.trim()
                                   ? formatTranscription(audio.transcription)
                                  : 'Este audio no tiene transcripción'}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>De momento no hay audios disponibles.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="galeriaComunidad mb-4">
            <div className="auxGaleria mb-3">
              <h3 className="galeriaTitle">Galería de la comunidad</h3>
              <button
                className="btn-sm buttonImg mr-2 ml-2"
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={loadingCommunityPhoto}
              >
                {loadingCommunityPhoto ? 'Subiendo...' : '+ Subir archivo'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadImage}
                style={{ display: 'none' }}
              />
            </div>

            <div className="community-gallery-grid">
              {communityPhotos.length > 0 ? (
                communityPhotos.map((photo) => {
                  const fileType = getFileType(photo.imagePath)
                  const fileName = photo.imagePath?.split('/').pop() || 'archivo'
                  return (
                    <div key={photo.id} className="card border-0 community-gallery-item">
                      <div className="related-image-item" style={{ borderRadius: 0 }}>
                        {fileType === 'image' ? (
                          <img
                            src={photo.image}
                            alt={photo.description}
                            className="community-gallery-image"
                            style={{ cursor: 'zoom-in' }}
                            onClick={() => setZoomedImage({ url: photo.image, label: photo.description })}
                          />
                        ) : fileType === 'video' ? (
                          <video
                            controls
                            className="community-gallery-image"
                            style={{ objectFit: 'contain', backgroundColor: '#000' }}
                          >
                            <source src={photo.image} />
                          </video>
                        ) : fileType === 'pdf' ? (
                          <div style={{ position: 'relative', width: '100%' }}>
                            <iframe
                              src={photo.image}
                              className="community-gallery-image"
                              style={{ border: 'none' }}
                              title={photo.description}
                            />
                            <button
                              onClick={() => setZoomedImage({ url: photo.image, label: photo.description, type: 'pdf' })}
                              title="Ampliar PDF"
                              style={{
                                position: 'absolute', top: '6px', right: '6px',
                                zIndex: 2, background: 'rgba(0,0,0,0.55)',
                                border: 'none', borderRadius: '6px',
                                color: '#fff', padding: '4px 7px',
                                cursor: 'pointer', fontSize: '1rem',
                                lineHeight: 1,
                              }}
                            >
                              <i className="bi bi-arrows-fullscreen" />
                            </button>
                          </div>
                        ) : fileType === 'audio' ? (
                          <div
                            className="community-gallery-image d-flex flex-column align-items-center justify-content-center"
                            style={{ backgroundColor: 'var(--color-grisOscuro)' }}
                          >
                            <i className="bi bi-music-note-beamed" style={{ fontSize: '2.5rem', color: 'var(--color1)' }}></i>
                            <audio controls style={{ width: '90%', marginTop: '8px' }}>
                              <source src={photo.image} />
                            </audio>
                          </div>
                        ) : (
                          <div
                            className="community-gallery-image d-flex flex-column align-items-center justify-content-center"
                            style={{ backgroundColor: 'var(--color-grisOscuro)' }}
                          >
                            <i className={`bi ${getFileIcon(photo.imagePath)}`} style={{ fontSize: '3rem', color: 'var(--color1)' }}></i>
                            <small style={{ color: 'var(--colorTexto)', wordBreak: 'break-all', textAlign: 'center', padding: '0 8px' }}>
                              {fileName}
                            </small>
                          </div>
                        )}
                        {fileType !== 'pdf' && (
                          <button
                            type="button"
                            className="download-btn"
                            onClick={() => downloadStorageFile('gallery', photo.imagePath, fileName)}
                          >
                            <i className="bi bi-download"></i>
                          </button>
                        )}
                      </div>

                      <div className="card-body infoCommunity">
                        <p className="mb-1 fw-bold">{photo.user}</p>
                        <p className="mb-1">{photo.date}</p>
                        <p className="mb-0">{photo.description}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <p>Oh oh! Parece que no hay archivos de la comunidad. Sé el primero en subir uno.</p>
              )}
            </div>

            <section className="community-comments mt-4">
              <div className="comments-header mb-3">
                <i className="bi bi-chat-left-text comments-icon"></i>
                <h3 className="commentsTitle mb-0">Comentarios</h3>
              </div>

              <div className="comment-form-box mb-4">
                <textarea
                  className="form-control community-textarea"
                  placeholder="Escribe un comentario..."
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="button"
                    className="btn btn-primary comment-button"
                    onClick={handlePublishComment}
                    disabled={loadingComment}
                  >
                    {loadingComment ? 'Publicando...' : 'Publicar'}
                  </button>
                </div>
              </div>

              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <article key={comment.id} className="comment-item">
                      <div className="comment-main">
                        <div className="comment-avatar">
                          {comment.avatar ? (
                            <img src={comment.avatar} alt={comment.user} />
                          ) : (
                            <div className="comment-avatar-placeholder"></div>
                          )}
                        </div>

                        <div className="comment-content">
                          <div className="comment-meta">
                            <span className="comment-user">{comment.user}</span>
                            <span className="comment-time">{comment.time}</span>
                            {currentUser && comment.userId && currentUser.id === comment.userId && (
                              <button
                                type="button"
                                className="btn btn-link text-danger btn-sm ms-2 p-0"
                                onClick={() => handleDeleteComment(comment.id)}
                                title="Eliminar comentario"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>

                          <p className="comment-text mb-0">{comment.text}</p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p>Oh oh! Parece que no hay comentarios. Sé el primero en comentar.</p>
                )}
              </div>
            </section>
          </section>
        </div>
      </div>
      {zoomedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0,
            width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
          }}
          onClick={() => setZoomedImage(null)}
        >
          <button
            type="button"
            style={{
              position: 'absolute', top: '20px', right: '20px',
              background: 'none', border: 'none',
              color: 'white', fontSize: '2rem', cursor: 'pointer',
            }}
            onClick={(e) => { e.stopPropagation(); setZoomedImage(null) }}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>
          {zoomedImage.type === 'pdf' ? (
            <iframe
              src={zoomedImage.url}
              style={{
                width: '90vw', height: '85vh',
                border: 'none', borderRadius: '8px',
              }}
              title={zoomedImage.label}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={zoomedImage.url}
              alt={zoomedImage.label}
              style={{
                maxHeight: '85vh', maxWidth: '100%',
                objectFit: 'contain', borderRadius: '10px',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {zoomedImage.label && (
            <p
              style={{ position: 'absolute', bottom: '20px', color: 'white', margin: 0, textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              {zoomedImage.label}
            </p>
          )}
        </div>
      )}
    </main>
  )
}

export default CharacterDetailPage

