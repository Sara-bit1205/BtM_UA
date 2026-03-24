import { useParams } from 'react-router-dom'
import React from 'react'
import '../../assets/styles/personajes.css';
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

function CharacterDetailPage() {
  const { slug } = useParams()
  const character = charactersMock.find((c) => c.slug === slug)
  // const gruposFilmografia = agruparDe2En2(character.filmography);

  if (!character) {
    return <main><h1>Personaje no encontrado</h1></main>
  }

  return (
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
}

export default CharacterDetailPage
