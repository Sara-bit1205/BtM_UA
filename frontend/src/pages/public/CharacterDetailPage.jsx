import { useParams } from 'react-router-dom'
<<<<<<< HEAD
import React from 'react'
import '../../assets/styles/personajes.css';
=======
import batmanImg from '../../assets/images/batman.jpg';
import captainAmericaImg from '../../assets/images/captainAmerica.jpg';
import maleficaImg from '../../assets/images/malefica.jpg';
import spidermanImg from '../../assets/images/spiderman.jpg';
import elsaImg from '../../assets/images/elsa.png';

import '../../assets/styles/home.css';
import '../../assets/styles/individualCharacter.css';

const charactersMock = [
  {
    id: "1",
    slug: "capitan-america",
    name: "Capitán América",
    universe: "Marvel",
    mbti: "ISFJ",
    mbtiTitle: "Defensor",
    image: captainAmericaImg,
    description: "Steve Rogers representa el deber, la lealtad y el sacrificio.",
    story: "Tras participar en un experimento, se convierte en el supersoldado Capitán América.",
    creationDate: "1941",
    firstAppearance: "Captain America Comics #1",
    procedence: "Brooklyn",
    biologicalOrigin: "Humano mejorado",
    personalityTags: ["Leal", "Valiente", "Protector"],
    filmography: [
        {
          title: "Captain America: The First Avenger",
          year: 2011,
          image: captainAmericaImg,
        },
        {
          title: "The Avengers",
          year: 2012,
          image: captainAmericaImg,
        },
        {
          title: "Endgame",
          year: 2019,
          image: captainAmericaImg,
        },
      ],
  },
  {
    id: "2",
    slug: "batman",
    name: "Batman",
    universe: "DC",
    mbti: "INTJ",
    mbtiTitle: "Arquitecto",
    image: batmanImg,
    description: "Bruce Wayne usa la inteligencia, la estrategia y la disciplina para combatir el crimen.",
    story: "Tras el asesinato de sus padres, dedica su vida a proteger Gotham.",
    creationDate: "1939",
    firstAppearance: "Detective Comics #27",
    procedence: "Gotham",
    biologicalOrigin: "Humano",
    personalityTags: ["Analítico", "Reservado", "Estratégico"],
    filmography: [
      {
        title: "Batman Begins",
        year: 2005,
        image: batmanImg,
      },
      {
        title: "The Dark Knight",
        year: 2008,
        image: batmanImg,
      },
      {
        title: "The Batman",
        year: 2022,
        image: batmanImg,
      },
    ],
  },
  {
    id: "3",
    slug: "malefica",
    name: "Maléfica",
    universe: "Disney",
    mbti: "INTJ",
    mbtiTitle: "Arquitecta",
    image: maleficaImg,
    description: "Maléfica destaca por su visión estratégica y su fortaleza emocional.",
    story: "Es uno de los personajes más complejos del universo Disney.",
    creationDate: "1959",
    firstAppearance: "Sleeping Beauty",
    procedence: "El Páramo",
    biologicalOrigin: "Hada",
    personalityTags: ["Intensa", "Independiente", "Visionaria"],
    filmography: [
      {
        title: "Sleeping Beauty",
        year: 1959,
        image: maleficaImg,
      },
      {
        title: "Maleficent",
        year: 2014,
        image: maleficaImg,
      },
      {
        title: "Maleficent: Mistress of Evil",
        year: 2019,
        image: maleficaImg,
      },
    ],
  },
  {
    id: "4",
    slug: "spiderman",
    name: "Spiderman",
    universe: "Marvel",
    mbti: "ENFP",
    mbtiTitle: "Activista",
    image: spidermanImg,
    description: "Peter Parker combina sensibilidad, humor e idealismo.",
    story: "Tras la picadura de una araña radiactiva, obtiene poderes extraordinarios.",
    creationDate: "1962",
    firstAppearance: "Amazing Fantasy #15",
    procedence: "New York",
    biologicalOrigin: "Humano mutado",
    personalityTags: ["Ingenioso", "Empático", "Valiente"],
    filmography: [
      {
        title: "Spider-Man",
        year: 2002,
        image: spidermanImg,
      },
      {
        title: "Homecoming",
        year: 2017,
        image: spidermanImg,
      },
      {
        title: "No Way Home",
        year: 2021,
        image: spidermanImg,
      },
    ],
  },
  {
    id: "5",
    slug: "elsa",
    name: "Elsa",
    universe: "Disney",
    mbti: "INFJ",
    mbtiTitle: "Abogada",
    image: elsaImg,
    description: "Elsa es introspectiva, sensible y profundamente idealista.",
    story: "Lucha por aceptar su identidad y controlar sus poderes.",
    creationDate: "2013",
    firstAppearance: "Frozen",
    procedence: "Arendelle",
    biologicalOrigin: "Humana con poderes mágicos",
    personalityTags: ["Reservada", "Profunda", "Protectora"],
    filmography: [
      {
        title: "Frozen",
        year: 2013,
        image: elsaImg,
      },
      {
        title: "Frozen II",
        year: 2019,
        image: elsaImg,
      },
    ],
  },
];

// function agruparDe2En2(items) {
//   const grupos = [];
//   for(let i = 0; i < items.length; i += 2){
//     //Se usa items.slice --> para tomar un subarray de 2 elementos a partir del índice i
//     grupos.push(items.slice(i, i + 2));
//   }
//   return grupos;
// }
>>>>>>> 92e3144 (Menú lateral y cambios en el estilo)

function CharacterDetailPage() {
  const { slug } = useParams()
  const character = charactersMock.find((c) => c.slug === slug)
  // const gruposFilmografia = agruparDe2En2(character.filmography);

  if (!character) {
    return <main><h1>Personaje no encontrado</h1></main>
  }

  return (
<<<<<<< HEAD
    <div className ="char-page-wrapper">
      <div className ="img-container mb-4">
        <img 
          src={`https://picsum.photos/seed/${id}/600/400`}
          alt="Imagen del personaje"
          className="img-fluid rounded"
        />
      </div>
      <main className = "container-fluid min-vh-100 p-0 char-scroll-container d-flex flex-column">
        <h1 className="char-title mb-4">Nombre del Personaje</h1>
        <h3 className="char-section-title mb-3">Universo/personalidad</h3>

        <div className="d-flex gap-3 mb-4">
          <span className="char-universe badge bg-secondary">Universo Marvel</span>
          <span className="char-mbti badge bg-info text-dark">MBTI: ENFP</span>
        </div>

        <section className ="mb-5">

          <h2 className="char-subsection-title mb-2">Historia y Origen</h2>
          <p>Maléfica, conocida originalmente como la villana de La Bella Durmiente (1959), es un hada poderosa y sombría que protege el reino mágico del Páramo. En la versión de 2014, se revela que era una joven de corazón puro traicionada por Stefan...</p>
        
        </section>

        <section className ="mb-5">
          <p><span className="fw-bold">Hito de creación:</span> 29/03/1959</p>
          <p><span className="fw-bold">Procedencia:</span> El Páramo (The Moors)</p>
          <p><span className="fw-bold">Origen biológico:</span> Hada (Fae oscura)</p>
        </section>

        {/* Contenedor principal del Acordeón */}
        <div className="accordion" id="acordeonPersonaje">
          
          {/* --- DESPLEGABLE 1: Actores --- */}
          <div className="accordion-item mb-3 bg-transparent border-0">
            <h2 className="accordion-header" id="headingActores">
              <button 
                className="accordion-button collapsed custom-acordeon-btn" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#collapseActores" 
                aria-expanded="false" 
                aria-controls="collapseActores"
              >
                Actores/as que lo han interpretado:
              </button>
            </h2>
            <div id="collapseActores" className="accordion-collapse collapse" aria-labelledby="headingActores" data-bs-parent="#acordeonPersonaje">
              <div className="accordion-body custom-acordeon-body">
                • Eleanor Audley (Voz original, 1959)<br />
                • Angelina Jolie (Live-action, 2014 y 2019)<br />
                • Kristin Chenoweth (Descendientes)
              </div>
            </div>
          </div>

          {/* --- DESPLEGABLE 2: Análisis MBTI --- */}
          <div className="accordion-item mb-3 bg-transparent border-0">
            <h2 className="accordion-header" id="headingMBTI">
              <button 
                className="accordion-button collapsed custom-acordeon-btn" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#collapseMBTI" 
                aria-expanded="false" 
                aria-controls="collapseMBTI"
              >
                Análisis de Personalidad (MBTI)
              </button>
            </h2>
            <div id="collapseMBTI" className="accordion-collapse collapse" aria-labelledby="headingMBTI" data-bs-parent="#acordeonPersonaje">
              <div className="accordion-body custom-acordeon-body">
                Maléfica es uno de los personajes más complejos del universo de Disney. 
                Su personalidad cambia bastante entre la versión clásica y la moderna.
              </div>
            </div>
          </div>

          {/* --- DESPLEGABLE 3: Modelo 3D --- */}
          <div className="accordion-item mb-3 bg-transparent border-0">
            <h2 className="accordion-header" id="heading3D">
              <button
                className="accordion-button collapsed custom-acordeon-btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapse3D"
                aria-expanded="false"
                aria-controls="collapse3D"
              >
                Modelo 3D interactivo
              </button>
            </h2>
            {/* Aquí faltaba la capa "collapse" de Bootstrap */}
            <div id="collapse3D" className="accordion-collapse collapse" aria-labelledby="heading3D" data-bs-parent="#acordeonPersonaje">
              <div className="accordion-body custom-acordeon-body p-2 text-center">
                  <model-viewer 
                      src="malefica/scene.gltf" 
                      alt="Modelo 3D de Maléfica" 
                      camera-controls="true" 
                      auto-rotate="true" 
                      // Corregido el style a formato React
                      style={{ width: '100%', height: '250px', backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
                  </model-viewer>
              </div>
            </div>
          </div>

          {/* --- DESPLEGABLE 4: Audio --- */}
          <div className="accordion-item mb-3 bg-transparent border-0">
            <h2 className="accordion-header" id="headingAudio">
              <button
                className="accordion-button collapsed custom-acordeon-btn"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseAudio"
                aria-expanded="false"
                aria-controls="collapseAudio"
              >
                Escucha al personaje: Frases icónicas y voz original
              </button>
            </h2>
            {/* Aquí faltaba la capa "collapse" de Bootstrap y tenías un ID repetido */}
            <div id="collapseAudio" className="accordion-collapse collapse" aria-labelledby="headingAudio" data-bs-parent="#acordeonPersonaje">
              <div className="accordion-body custom-acordeon-body text-center">
                  {/* Corregido el style a formato React */}
                  <audio controls style={{ width: '100%', marginTop: '10px' }}>
                    {/* Corregida la etiqueta source para que se cierre con /> */}
                    <source src="malefica/voz-original.mp3" type="audio/mpeg" />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
              </div>
            </div>
          </div>

        </div>

      </main>
      
    </div>
  );
=======
    <main className = "character-detail-page">
        <div className="cardPersonajeIndividual">
          <img src={character.image} className="card-img-top" alt={character.name} />
          <div className="card-body">
            <div className = "card-header mb-3">
              <h1 className="card-title">{character.name}</h1>
              <i className="bi bi-heart" style={{ color: 'var(--color4)', fontSize: '1.5rem' }}></i>
            </div>
            <h3 className="card-subtitle mb-2">Universo {character.universe} / Personalidad: {character.personalityTags.join(", ")}</h3>
            
            <section className="auxiliar mb-3">
              <div className="etiquetaMBTI text-center mb-2">
                <span className = "tituloMBTI">Personalidad</span>
                <span className="mbti">{character.mbti} </span>
                <span className="mbtiTitle">{character.mbtiTitle}</span>
              </div>
            </section>

            <section className = "history mb-3">
                <div className = "historyParts mb-2">
                  <i className="bi bi-feather featherIcon" style={{ color: 'var(--colorTexto)', fontSize: '1.8rem' }}></i>
                  <h3 className = "historyTitle"> Historia: </h3>
                </div> 
                <p className="card-text">{character.story}</p>
             
                <div className = "historyParts mb-2">
                  <h4 className = "hitoCreacion">Hito de creación: </h4>
                  <p className="card-text">{character.creationDate}</p>
                </div>
                
                <div className = "historyParts mb-2">
                  <h4 className = "procedencia">Procedencia: </h4>
                  <p className="card-text">{character.procedence}</p>
                </div>
                
                <div className = "historyParts mb-2">
                  <h4 className = "origenBiologico">Origen biológico: </h4>
                  <p className="card-text">{character.biologicalOrigin}</p>
                </div>
            </section>

            <hr className="divider-thick mb-3" />

            <section className="filmography mb-3">
              <h3 className="filmographyTitle">Filmografía:</h3>

              <div
                id="filmographyCarousel"
                className="carousel slide filmographyCarousel"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {character.filmography.map((movie, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? 'active' : ''}`}
                    >
                      <div className="filmography-slide card-body">
                        <div className="card filmography-card">
                          <img
                            src={movie.image}
                            className="card-img-top filmography-card-img"
                            alt={movie.title}
                          />
                          <div className="card-body">
                            <h4 className="filmography-card-title text-truncate">{movie.title}</h4>
                            <p className="filmography-card-year mb-0">{movie.year}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#filmographyCarousel"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>

                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#filmographyCarousel"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Siguiente</span>
                </button>
              </div>
            </section>
          </div>
        </div>
    </main>
  )
>>>>>>> 92e3144 (Menú lateral y cambios en el estilo)
}

export default CharacterDetailPage
