import { useParams } from 'react-router-dom'
import React from 'react'
import { useState, useEffect } from 'react';
import '../../assets/styles/personajes.css';
import { supabase } from '../../lib/supabase.js';

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
    actors: [
      "Chris Evans (2011-2019)",
      "Reb Brown (1979, 1990)"
    ],
    psicologicalAnalisis: "Capitán América es un personaje que encarna los valores de la justicia, el honor y el sacrificio. Su personalidad ISFJ lo hace ser un héroe protector, leal y comprometido con su causa, pero también puede ser rígido y a veces inflexible. A lo largo de sus historias, Steve Rogers enfrenta dilemas morales y emocionales que reflejan su fuerte sentido del deber y su deseo de hacer lo correcto.",
    sound: ["captain-america/voz-original.mp3"],
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
    actors: [
      "Michael Keaton (1989-1992)",
      "Christian Bale (2005-2012)",
    ],
    psicologicalAnalisis: "Batman es un personaje que encarna la lucha entre la justicia y el deseo de vivir una vida normal. Su personalidad INTJ lo hace ser un héroe estratégico, analítico y reservado, pero también puede ser obsesivo y a veces distante. A lo largo de sus historias, Bruce Wayne enfrenta dilemas morales y emocionales que reflejan su compleja psicología.",
    sound: ["batman/voz-original.mp3"],

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
    actors: [
      "Eleanor Audley (1959)",
      "Angelina Jolie (2014-2019)"
    ],
    psicologicalAnalisis: "Maléfica es un personaje que encarna la lucha entre el bien y el mal. Su personalidad INTJ lo hace ser una villana compleja, estratégica y poderosa, pero también puede ser manipuladora y a veces cruel. A lo largo de sus historias, Maléfica enfrenta dilemas morales y emocionales que reflejan su compleja psicología.",
    sound: ["malefica/voz-original.mp3"],
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
    actors: [
      "Tobey Maguire (2002-2007)",
      "Andrew Garfield (2012-2014)",
      "Tom Holland (2016-presente)"
    ],
    psicologicalAnalisis: "Spiderman es un personaje que encarna la lucha entre la responsabilidad y el deseo de vivir una vida normal. Su personalidad ENFP lo hace ser un héroe apasionado, creativo y empático, pero también puede ser impulsivo y a veces inseguro. A lo largo de sus historias, Peter Parker enfrenta dilemas morales y emocionales que reflejan su compleja psicología.",
    sound: ["spiderman/voz-original.mp3"],
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
    actors: [
      "Idina Menzel (2013-2019)"
    ],
    psicologicalAnalisis: "Elsa es un personaje que encarna la lucha entre la introspección y la expresión emocional. Su personalidad INFJ la hace ser una persona profunda, empática y creativa, pero también puede ser reservada y a veces indecisa. A lo largo de sus historias, Elsa enfrenta dilemas morales y emocionales que reflejan su compleja psicología.",
    sound: ["elsa/voz-original.mp3"],
  },
];

const communityPhotosMock = [
  { id: 1, image: maleficaImg, alt: 'Cosplay de Maléfica 1' },
  { id: 2, image: elsaImg, alt: 'Fan art de Elsa' },
  { id: 3, image: batmanImg, alt: 'Cosplay de Batman' },
  { id: 4, image: spidermanImg, alt: 'Cosplay de Spiderman' },
  { id: 5, image: captainAmericaImg, alt: 'Cosplay de Capitán América' },
];

const commentsMock = [
  {
    id: 1,
    user: 'Usuario1',
    avatar: batmanImg,
    time: 'Hace 2 horas',
    text: '¡Super chulo el cosplay!',
  },
  {
    id: 2,
    user: 'Usuario2',
    avatar: maleficaImg,
    time: 'Hace 1 min',
    text: 'El mío es mejor',
  },
];

function CharacterDetailPage() {
  const { slug } = useParams()
  const character = charactersMock.find((c) => c.slug === slug)
  const ultimasFotos = communityPhotosMock.slice(-4).reverse();
  const [isFavorite, setIsFavorite] = useState(false);

  if (!character) {
    return <main><h1>Personaje no encontrado</h1></main>
  }

  const handleFavorite = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    if (isFavorite) {
      // quitar favorito
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('character_id', character.id);

      setIsFavorite(false);
    } else {
      // añadir favorito
      await supabase.from('favorites').insert({
        user_id: user.id,
        character_id: character.id,
      });

      setIsFavorite(true);
    }
  };

  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .eq('character_id', character.id)
        .single();

      if (data) setIsFavorite(true);
    };

    checkFavorite();
  }, [character.id]);

  return (
    <main className = "character-detail-page">
        <div className="cardPersonajeIndividual">
          <img src={character.image} className="card-img-top" alt={character.name} />
          <div className="card-body">
            <div className="card-header mb-3">
              <h1 className="card-title">{character.name}</h1>
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} favorite-icon`} onClick={handleFavorite}></i>
            </div>
            <h3 className="card-subtitle mb-2">Universo {character.universe} / Personalidad: {character.personalityTags.join(", ")}</h3>
            
            <section className="auxiliar mt-5 mb-3">
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

            <section className="filmography mb-4">
              <div className="d-flex justify-content-between align-items-end mb-3 px-2">
                <h3 className="filmographyTitle m-0">Filmografía:</h3>
              </div>

              <div className="d-flex flex-nowrap overflow-x-auto gap-3 py-3 px-2 filmography-slider" style={{ scrollBehavior: 'smooth' }}>
                {character.filmography.map((movie, index) => (
                  <div key={index}
                    className="card border-0 flex-shrink-0 filmography-card"
                    style={{
                      width: '240px',
                      backgroundColor: 'var(--color-principal)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
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
                        {movie.year}
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
                ))}
              </div>
            </section>

            <section className = "accordion btmAccordion" id="acordeonPersonaje">
              {/* --- DESPLEGABLE 1: Actores --- */}
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
                <div id="collapseActores" className="accordion-collapse collapse" aria-labelledby="headingActores" data-bs-parent="#acordeonPersonaje">
                  <div className="accordion-body custom-acordeon-body btm-accordion-body">
                    <ul className="actor-list">
                      {character.actors.map((actor, index) => (
                        <li key={index}>{actor}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* --- DESPLEGABLE 2: Análisis MBTI --- */}
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
                <div id="collapseMBTI" className="accordion-collapse collapse" aria-labelledby="headingMBTI" data-bs-parent="#acordeonPersonaje">
                  <div className="accordion-body custom-acordeon-body btm-accordion-body">
                    {character.psicologicalAnalisis}
                  </div>
                </div>
              </div>

              {/* --- DESPLEGABLE 3: Modelo 3D --- */}
              {/* <div className="accordion-item mb-3 bg-transparent border-0 btm-accordion-item">
                <h2 className="accordion-header" id="heading3D">
                  <button
                    className="accordion-button collapsed btm-accordion-btn"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapse3D"
                    aria-expanded="false"
                    aria-controls="collapse3D"
                  >
                    Modelo 3D interactivo
                  </button>
                </h2> */}
                {/* Aquí faltaba la capa "collapse" de Bootstrap */}
                {/* <div id="collapse3D" className="accordion-collapse collapse" aria-labelledby="heading3D" data-bs-parent="#acordeonPersonaje">
                  <div className="accordion-body custom-acordeon-body p-2 text-center btm-accordion-body">
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
              </div> */}

              {/* --- DESPLEGABLE 3: Imágenes --- */}
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
                <div id="collapseImgs" className="accordion-collapse collapse" aria-labelledby="headingImgs" data-bs-parent="#acordeonPersonaje">
                  <div className="accordion-body custom-acordeon-body btm-accordion-body">
                    <div className="related-images-grid">
                      {[character.image, character.image, character.image, character.image].map((img, index) => (
                        
                        <div key={index} className="related-image-item">

                          <img
                            src={img}
                            alt={`${character.name} ${index}`}
                            className="related-image"
                          />
                          {/* BOTÓN DESCARGA */}
                          <a href={img} download className="download-btn">
                            <i className="bi bi-download"></i>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- DESPLEGABLE 4: Audio --- */}
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
                {/* Aquí faltaba la capa "collapse" de Bootstrap y tenías un ID repetido */}
                <div id="collapseAudio" className="accordion-collapse collapse" aria-labelledby="headingAudio" data-bs-parent="#acordeonPersonaje">
                  <div className="accordion-body custom-acordeon-body text-center btm-accordion-body">
                      {/* Corregido el style a formato React */}
                      <audio controls style={{ width: '100%', marginTop: '10px' }}>
                        {/* Corregida la etiqueta source para que se cierre con /> */}
                        <source src={character.sound[0]} type="audio/mpeg" />
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                  </div>
                </div>
              </div>
            </section>

            <section className = "galeriaComunidad mb-4">
              <div className = "auxGaleria mb-3">
                <h3 className = "galeriaTitle">Galería de la comunidad </h3>
                <button className=" btn-sm buttonImg mr-2 ml-2"> + Subir imagen</button>
              </div>
              <div className="community-gallery-grid">
                {ultimasFotos.map((foto) => (
                  <div key={foto.id} className="community-gallery-item">
                    <img
                      src={foto.image}
                      alt={foto.alt}
                      className="community-gallery-image"
                    />
                  </div>
                ))}
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
                    rows={4}></textarea>

                  <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="btn btn-primary comment-button">
                      Publicar
                    </button>
                  </div>
                </div>

                <div className="comments-list">
                  {commentsMock.map((comment) => (
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
                  ))}
                </div>
              </section>

            </section>
          </div>
        </div>
    </main>
  )
}

export default CharacterDetailPage
