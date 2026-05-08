
import { Link } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import '../../assets/styles/home.css'
import characterService from '../../services/characterService'
import arquitectoIcono from '../../assets/images/bricks.svg'

function getDailyCharacterIndex(total) {
  if (!total) return 0;

  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  let num = 0;
  for (let i = 0; i < dateKey.length; i++) {
    num = (num * 31 + dateKey.charCodeAt(i)) % total;
  }

  return Math.abs(num) % total;
}

function agruparItems(items, size) {
  const grupos = [];
  for (let i = 0; i < items.length; i += size) {
    grupos.push(items.slice(i, i + size));
  }
  return grupos;
}


function HomePage() {

  const getItemsPerSlide = () => {
    const width = window.innerWidth; //mira ancho de la pantalla
    if (width >= 992) return 3; // lg 
    if (width >= 768) return 2; // md
    return 1; // móvil
  };

  //Estados que se pueden dar en la pag:
  const [itemsPorSlide, setItemsPorSlide] = useState(getItemsPerSlide()); //num personajes por slide en carrusel

  const [personajeDelDia, setPersonajeDelDia] = useState(null); //objeto del personaje del dia con sus datos
  const [loadingPersonajeDelDia, setLoadingPersonajeDelDia] = useState(true); //si se está cargando el personaje --> true o false

  const [personajesPopulares, setPersonajesPopulares] = useState([]);  //array de personajes populares con sus datos
  const [loadingPersonajesPopulares, setLoadingPersonajesPopulares] = useState(true); //si se están cargando los personajes populares --> true o false

  const [personalidades, setPersonalidades] = useState([]); //las 2 persoladidades mbti mas populares
  const [loadingPersonalidades, setLoadingPersonalidades] = useState(true); //si se estan cargando

  useEffect(() => {
    const handleResize = () => {
      setItemsPorSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useEffect(() => {
    const loadPersonajeDelDia = async () => {
      try {
        setLoadingPersonajeDelDia(true)

        const characters = await characterService.getHomeCharacterOfTheDay()

        if (!characters || characters.length === 0) {
          setPersonajeDelDia(null)
          return
        }

        const index = getDailyCharacterIndex(characters.length)
        const selectedCharacter = characters[index]

        setPersonajeDelDia(selectedCharacter)
      } catch (error) {
        console.error('Error cargando personaje del día:', error.message)
        setPersonajeDelDia(null)
      } finally {
        setLoadingPersonajeDelDia(false)
      }
    }

    loadPersonajeDelDia()
  }, []);

  useEffect(() => {
    const loadPersonajesPopulares = async () => {
      try {
        setLoadingPersonajesPopulares(true)

        const data = await characterService.getHomePopularCharacters(6)
        setPersonajesPopulares(data)
      } catch (error) {
        console.error('Error cargando personajes populares:', error.message)
        setPersonajesPopulares([])
      } finally {
        setLoadingPersonajesPopulares(false)
      }
    }

    loadPersonajesPopulares()
  }, []);
 
  useEffect(() => {
    const loadPersonalidadesPopulares = async () => {
      try {
        setLoadingPersonalidades(true)

        const data = await characterService.getPopularMbtiTypes(2)

        const formatted = data.map((item) => ({
          ...item,
          icono: arquitectoIcono,
        }))

        setPersonalidades(formatted)
      } catch (error) {
        console.error('Error cargando personalidades populares:', error.message)
        setPersonalidades([])
      } finally {
        setLoadingPersonalidades(false)
      }
    }

    loadPersonalidadesPopulares()
  }, []);


 const gruposPersonajes = useMemo(() => {
    return agruparItems(personajesPopulares, itemsPorSlide);
  }, [personajesPopulares, itemsPorSlide]);

  return (
    <main className="container py-4 home-page">
      <div className="row g-5">
        {/* PERSONAJE DEL DÍA */}
        <div className="col-12">
          <h1 className="home-section-title mb-3 text-center">PERSONAJE DEL DÍA</h1>

          {loadingPersonajeDelDia ? (
            <p className="text-center">Cargando personaje del día...</p>
          ) : personajeDelDia ? (
            <div className="card text-bg-dark card-personaje-del-dia">
              {personajeDelDia.imagen && (
                <Link className="nav-link" to={`/personaje/${personajeDelDia.slug}`}>
                  <img
                    src={personajeDelDia.imagen}
                    className="card-img card-personaje-del-dia-img"
                    alt={personajeDelDia.nombre}
                  />
                </Link>
              )}

              <div className="position-absolute bottom-0 start-0 end-0 p-3 d-flex flex-column justify-content-end personaje-del-dia-overlay">
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <Link className="nav-link" to={`/personaje/${personajeDelDia.slug}`}>
                      <h3 className="card-title mb-1 text-uppercase fw-bold nombre-del-dia">
                        {personajeDelDia.nombre}
                      </h3>
                    </Link>

                    <p className="card-text mb-0">
                      Universo {personajeDelDia.universo}
                    </p>
                  </div>

                  <Link className="nav-link" to="/tipos-personalidad">
                    <span className="badge rounded-pill home-mbti-badge mr-2">
                      {personajeDelDia.mbti}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">No hay personaje del día disponible.</p>
          )}
        </div>

        {/* PERSONAJES POPULARES */}
        <div className="col-12">
          <div
            id="popularCharactersCarousel"
            className="carousel slide popular-carousel"
            data-bs-ride="carousel"
          >
            <h1 className="home-section-title mb-3 text-center">PERSONAJES POPULARES</h1>

            {loadingPersonajesPopulares ? (
              <p className="text-center">Cargando personajes populares...</p>
            ) : personajesPopulares.length === 0 ? (
              <p className="text-center">No hay personajes populares disponibles.</p>
            ) : (
              <>
                <div className="carousel-inner">
                  {gruposPersonajes.map((grupo, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {grupo.map((personaje) => (
                          <div className="col" key={personaje.slug}>
                            <div className="card popular-card">
                              <Link className="nav-link" to={`/personaje/${personaje.slug}`}>
                                {personaje.imagen && (
                                  <img
                                    src={personaje.imagen}
                                    className="card-img-top popular-card-img"
                                    alt={personaje.nombre}
                                  />
                                )}
                              </Link>

                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start gap-2">
                                  <div style={{ minWidth: 0 }}>
                                    <Link className="nav-link" to={`/personaje/${personaje.slug}`}>
                                      <h3 className="card-title popular-card-title text-truncate">
                                        {personaje.nombre}
                                      </h3>
                                    </Link>

                                    <p className="card-text mb-0 text-truncate">
                                      {personaje.universo}
                                    </p>
                                  </div>

                                  <Link className="nav-link" to="/tipos-personalidad">
                                    <span className="badge rounded-pill home-mbti-badge-small">
                                      {personaje.mbti}
                                    </span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#popularCharactersCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#popularCharactersCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* PERSONALIDADES MÁS POPULARES */}
        <div className="col-12">
          <h1 className="home-section-title2 mb-3">PERSONALIDADES MBTI POPULARES</h1>

          {loadingPersonalidades ? (
            <p>Cargando personalidades populares...</p>
          ) : personalidades.length === 0 ? (
            <p>No hay personalidades disponibles.</p>
          ) : (
            personalidades.map((item, index) => (
              <div className="card personality-card mb-3" key={index}>
                <div className="card-body d-flex align-items-center gap-3 mb-3">
                  <div className="personality-icon-wrapper">
                    <img src={item.icono} alt={item.tipo} className="personality-icon" />
                  </div>

                  <div>
                    <h3 className="mb-1 fw-bold tipoPersonalidad-titulo">{item.tipo}</h3>
                    <p className="mb-0">{item.descripcion}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default HomePage;