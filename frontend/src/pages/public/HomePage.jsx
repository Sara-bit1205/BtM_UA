//HECHO
import { Link } from 'react-router-dom'
import React, { useEffect, useMemo, useState } from 'react'
import '../../assets/styles/home.css'
import characterService from '../../services/characterService'
import arquitectoIcono from '../../assets/images/bricks.svg'

//Función que recive el cover_path --> para en storage/avatars sacar la imagen de cover correcta
//lo que devuelve es una url publica para poder poder ponerla en --> <img src= ... />
// function getCharacterCoverUrl(coverPath) {
//   if (!coverPath) return null;

//   const { data } = supabase.storage.from('character-covers').getPublicUrl(coverPath);

//   return data.publicUrl;
// }

// Devuelve un número entre 0 y total -1 según la fecha de hoy
//total es el num total de personajes que tenemos en bbdd
//ej: getDailyCharacter(10 ) --Z devuelve 3, pues --> selectedCharacter = data[3] sera el persoanje del dia
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

//Función para agrupar los personajes populares en el carrusel en grupo segun tamaño pantalla --> 1,2,3
//items --> array de personajes populares, size --> num de items por slide (1,2 o 3)
//ej: si tenemos 5 personajes populares y size = 2 --> devuelve [[perso1, perso2], [perso3, perso4], [perso5]]
function agruparItems(items, size) {
  const grupos = [];
  for (let i = 0; i < items.length; i += size) {
    grupos.push(items.slice(i, i + size));
  }
  return grupos;
}

//Funcion para sacar el valor de una relacion (universo o mbti)
//Supabase puede devolver las cosas como: universes = { name: 'Disney' } "Objeto" o como universes = [ { name: 'Disney' } ] "Array con un objeto dentro"
//Por eso si es objeto --> devolveria ese campo directamente y si es array devuelve el primer elemento
// function getRelationValue(relation, field){
//   if(Array.isArray(relation)){
//     return relation[0]?.[field];
//   }
//   return relation?.[field];
// }

//Función principal del Home
function HomePage() {

  //Para sacar cuantos personajes mostrar en el carrusel según el tamaño de la pantalla
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


  //Efectos que se dan en la pagina como respuesta a cambios en el estado o al cargar la pagina:

  //Cuando cambia el tamaño de la pagina (resize) --> se vuelve a calcular el numero de items por slide para el carrusel
  //[] --> significa que solo se ejecuta 1 vez al cargar la pagina y montar el cmponente
  useEffect(() => {
    const handleResize = () => {
      setItemsPorSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  //Carga tds los personajes desde supabase y elige uno usando getDailyCharacterIndex
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

  //Carga de los persnajes populares
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
 

  //Cargar personalidades mbti mas populares
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


  //Agrupamos los personajes populares en grupos segun el numero de items por slide para mostrarlos en el carrusel
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
              <Link className="nav-link" to={`/personaje/${personajeDelDia.slug}`}>
                {personajeDelDia.imagen && (
                  <img
                    src={personajeDelDia.imagen}
                    className="card-img card-personaje-del-dia-img"
                    alt={personajeDelDia.nombre}
                  />
                )}
              </Link>
              <div className="card-img-overlay d-flex flex-column justify-content-end personaje-del-dia-overlay">
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <Link className="nav-link" to={`/personaje/${personajeDelDia.slug}`}>
                      <h3 className="card-title mb-1 text-uppercase fw-bold nombre-del-dia">
                        {personajeDelDia.nombre}
                      </h3>
                    </Link>
                    <Link className="nav-link" to={`/categorias/${personajeDelDia.universo.toLowerCase().replace(/\s+/g, '-')}`}>
                      <p className="card-text mb-0">
                        Universo {personajeDelDia.universo}
                      </p>
                    </Link>
                  </div>

                  <Link className="nav-link" to="/categorias/:id">
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

                                  <span className="badge rounded-pill home-mbti-badge-small">
                                    {personaje.mbti}
                                  </span>
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