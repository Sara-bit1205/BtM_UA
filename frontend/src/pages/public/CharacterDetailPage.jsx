import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import favoritesService from '../../services/favoritesService'
import maleficaImg from '../../assets/images/malefica.jpg'

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

function CharacterDetailPage() {
  const { slug } = useParams()

  const [character, setCharacter] = useState(null)
  const [filmography, setFilmography] = useState([])
  const [actors, setActors] = useState([])
  const [relatedImages, setRelatedImages] = useState([])

  const [isFavorite, setIsFavorite] = useState(false)

  const [loadingCharacter, setLoadingCharacter] = useState(true)
  const [loadingFavorite, setLoadingFavorite] = useState(false)

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
          image: getCharacterCoverUrl(characterData.cover_path) || maleficaImg,
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
          image: getFilmCoverUrl(movie.cover_path) || maleficaImg,
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
          image: getCharacterMediaUrl(item.file_path) || maleficaImg,
        }))

        setRelatedImages(formattedImages)
      } catch (error) {
        console.error('Error cargando personaje:', error.message)
        setCharacter(null)
      } finally {
        setLoadingCharacter(false)
      }
    }

    loadCharacter()
  }, [slug])

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
                      <a href={movie.image} download className="download-btn">
                        <i className="bi bi-download"></i>
                      </a>
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
                          <a href={img.image} download className="download-btn">
                            <i className="bi bi-download"></i>
                          </a>
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
              <button className="btn-sm buttonImg mr-2 ml-2">+ Subir imagen</button>
            </div>

            <div className="community-gallery-grid">
              <p>De momento no hay fotos de la comunidad.</p>
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
                ></textarea>

                <div className="d-flex justify-content-end mt-3">
                  <button type="button" className="btn btn-primary comment-button">
                    Publicar
                  </button>
                </div>
              </div>

              <div className="comments-list">
                <p>De momento no hay comentarios.</p>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  )
}

export default CharacterDetailPage