//HECHO
import { useParams } from 'react-router-dom'
import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase.js'
import favoritesService from '../../services/favoritesService'
// import maleficaImg from '../../assets/images/malefica.jpg'

import '../../assets/styles/home.css'
import '../../assets/styles/individualCharacter.css'

// ---------- Helpers ----------
function getRelationValue(relation, field) {
  if (Array.isArray(relation)) {
    return relation[0]?.[field]
  }
  return relation?.[field]
}

function getCharacterCoverUrl(coverPath) {
  if (!coverPath) return null

  const { data } = supabase.storage
    .from('character-covers')
    .getPublicUrl(coverPath)

  return data.publicUrl
}

function getFilmCoverUrl(coverPath) {
  if (!coverPath) return null

  const { data } = supabase.storage
    .from('films-cover')
    .getPublicUrl(coverPath)

  return data.publicUrl
}

function getCharacterMediaUrl(filePath) {
  if (!filePath) return null

  const { data } = supabase.storage
    .from('character-media')
    .getPublicUrl(filePath)

  return data.publicUrl
}

function getGalleryImageUrl(filePath) {
  if (!filePath) return null

  const { data } = supabase.storage
    .from('gallery')
    .getPublicUrl(filePath)

  return data.publicUrl
}

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

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        setLoadingCharacter(true)

        // 1) personaje principal
        const { data: characterData, error: characterError } = await supabase
          .from('characters')
          .select(`
            id,
            name,
            slug,
            description,
            story,
            creation_date,
            first_appearance,
            biological_origin,
            place_of_origin,
            psychological_analysis,
            cover_path,
            universes (
              name
            ),
            mbti_types (
              code,
              title
            )
          `)
          .eq('slug', slug)
          .single()

        if (characterError) throw characterError

        if (!characterData) {
          setCharacter(null)
          return
        }

        const characterId = characterData.id

        const formattedCharacter = {
          id: characterData.id,
          slug: characterData.slug,
          name: characterData.name,
          description: characterData.description,
          story: characterData.story,
          creationDate: characterData.creation_date,
          firstAppearance: characterData.first_appearance,
          procedence: characterData.place_of_origin,
          biologicalOrigin: characterData.biological_origin,
          psicologicalAnalisis: characterData.psychological_analysis,
          universe: getRelationValue(characterData.universes, 'name') || 'Sin universo',
          mbti: getRelationValue(characterData.mbti_types, 'code') || '—',
          mbtiTitle: getRelationValue(characterData.mbti_types, 'title') || '',
          image: getCharacterCoverUrl(characterData.cover_path),
        }

        setCharacter(formattedCharacter)

        // 2) favoritos
        const favoriteStatus = await favoritesService.isFavorite(characterId)
        setIsFavorite(favoriteStatus)

        // 3) filmografía
        const { data: filmographyData, error: filmographyError } = await supabase
          .from('filmography')
          .select(`
            id,
            title,
            year,
            cover_path
          `)
          .eq('character_id', characterId)
          .order('year', { ascending: true })

        if (filmographyError) throw filmographyError

        const formattedFilmography = (filmographyData || []).map((movie) => ({
          id: movie.id,
          title: movie.title,
          year: movie.year,
          coverPath: movie.cover_path,
          image: getFilmCoverUrl(movie.cover_path),
        }))

        setFilmography(formattedFilmography)

        // 4) actores
        const { data: actorsData, error: actorsError } = await supabase
          .from('character_actors')
          .select(`
            id,
            actor_name,
            role_description,
            years_active,
            sort_order
          `)
          .eq('character_id', characterId)
          .order('sort_order', { ascending: true })

        if (actorsError) throw actorsError

        const formattedActors = (actorsData || []).map((actor) => {
          let text = actor.actor_name

          if (actor.role_description) {
            text += ` — ${actor.role_description}`
          }

          if (actor.years_active) {
            text += ` (${actor.years_active})`
          }

          return {
            id: actor.id,
            text,
          }
        })

        setActors(formattedActors)

        // 5) imágenes relacionadas
        const { data: mediaData, error: mediaError } = await supabase
          .from('character_media')
          .select(`
            id,
            type,
            title,
            file_path,
            sort_order,
            created_at
          `)
          .eq('character_id', characterId)
          .eq('type', 'image')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true })

        if (mediaError) throw mediaError

        const formattedImages = (mediaData || []).map((item) => ({
          id: item.id,
          title: item.title || characterData.name,
          filePath: item.file_path,
          image: getCharacterMediaUrl(item.file_path),
        }))

        setRelatedImages(formattedImages)

        // 6) fotos de la comunidad
        const { data: communityPhotosData, error: communityPhotosError } = await supabase
          .from('community_photos')
          .select(`
            id,
            image_path,
            description,
            created_at,
            profiles ( username )
          `)
          .eq('character_id', characterId)
          .order('created_at', { ascending: false })

        if (communityPhotosError) throw communityPhotosError

        const formattedCommunityPhotos = (communityPhotosData || []).map((photo) => ({
          id: photo.id,
          description: photo.description || 'Foto de la comunidad',
          image: getGalleryImageUrl(photo.image_path),
          user: photo.profiles?.username || 'Usuario',
          date: new Date(photo.created_at).toLocaleDateString('es-ES'),
        }))

        setCommunityPhotos(formattedCommunityPhotos)

        // 7) comentarios
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            id,
            comment,
            created_at,
            user_id,
            profiles (
              username,
              avatar_path
            )
          `)
          .eq('character_id', characterId)
          .order('created_at', { ascending: false })

        if (commentsError) throw commentsError

        const { data: authData } = await supabase.auth.getUser()
        const currentUserId = authData?.user?.id

        const formattedComments = (commentsData || []).map((comment) => ({
          id: comment.id,
          user:
            comment.user_id === currentUserId
              ? 'Tú'
              : comment.profiles?.username || 'Usuario',
          avatar: comment.profiles?.avatar_path
            ? supabase
                .storage
                .from('avatars')
                .getPublicUrl(comment.profiles.avatar_path).data.publicUrl
            : null,
          time: new Date(comment.created_at).toLocaleDateString('es-ES'),
          text: comment.comment,
        }))

        setComments(formattedComments)

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
      ? supabase.storage
          .from('avatars')
          .getPublicUrl(authData.user.user_metadata.avatar_path).data.publicUrl
      : null
      
      const newFormattedComment = {
        id: data.id,
        user: 'Tú',
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

  const handleUploadImage = async (event) => {
    try {
      const file = event.target.files[0]

      if (!file) return

      if (!character) return

      const { data: authData, error: authError } = await supabase.auth.getUser()
      if (authError) throw authError

      const user = authData?.user

      if (!user) {
        alert('Debes iniciar sesión para subir una imagen')
        return
      }

      setLoadingCommunityPhoto(true)

      // nombre único para que no choque con otros archivos
      const fileName = `${Date.now()}-${file.name}`

      // 1) subir archivo al bucket gallery
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2) guardar registro en la tabla community_photos
      const { data, error: insertError } = await supabase
        .from('community_photos')
        .insert({
          character_id: character.id,
          user_id: user.id,
          image_path: fileName,
          description: uploadDescription || 'Foto de la comunidad',
        })
        .select()
        .single()

      if (insertError) throw insertError

      // 3) añadir la nueva foto a la galería en pantalla
      const newPhoto = {
        id: data.id,
        description: data.description || 'Foto de la comunidad',
        image: getGalleryImageUrl(data.image_path) || null,
        user: user.user_metadata?.username || user.email || 'Tú',
        date: new Date().toLocaleDateString('es-ES'),
      }

      setCommunityPhotos((prev) => [newPhoto, ...prev])
      setUploadDescription('')

      // limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      alert('Imagen subida correctamente')
    } catch (error) {
      console.error('Error subiendo imagen:', error.message)
      alert('No se pudo subir la imagen')
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

  function getFileExtension(path) {
    if (!path) return 'jpg'
    return path.split('.').pop()
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
        <img src={character.image} className="card-img-top" alt={character.name} />

        <div className="card-body">
          <div className="card-header mb-3">
            <h1 className="card-title">{character.name}</h1>

            <i
              className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} favorite-icon`}
              onClick={handleFavorite}
              style={{
                cursor: loadingFavorite ? 'default' : 'pointer',
                opacity: loadingFavorite ? 0.6 : 1,
              }}
            ></i>
          </div>

          <h3 className="card-subtitle mb-2">
            Universo {character.universe}
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
                <div className="accordion-body custom-acordeon-body text-center btm-accordion-body">
                  <p>De momento no hay audios disponibles.</p>
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
                {loadingCommunityPhoto ? 'Subiendo...' : '+ Subir imagen'}
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleUploadImage}
                style={{ display: 'none' }}
              />
            </div>

            <div className="community-gallery-grid">
              {communityPhotos.length > 0 ? (
                communityPhotos.map((photo) => (
                  <div key={photo.id} className="card border-0 community-gallery-item">
                    <img
                      src={photo.image}
                      alt={photo.description}
                      className="card-img-top community-gallery-image"
                    />

                    <div className="card-body infoCommunity">
                      <p className="mb-1 fw-bold">{photo.user}</p>
                      <p className="mb-1">{photo.date}</p>
                      <p className="mb-0">{photo.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>De momento no hay fotos de la comunidad.</p>
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
                          <img src={comment.avatar} alt={comment.user} />
                        </div>

                        <div className="comment-content">
                          <div className="comment-meta">
                            <span className="comment-user">{comment.user}</span>
                            <span className="comment-time">{comment.time}</span>
                          </div>

                          <p className="comment-text mb-0">{comment.text}</p>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p>De momento no hay comentarios.</p>
                )}
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  )
}

export default CharacterDetailPage

