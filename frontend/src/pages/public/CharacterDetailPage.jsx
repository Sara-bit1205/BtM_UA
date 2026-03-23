import { useParams } from 'react-router-dom'
import React from 'react'
import '../../assets/styles/personajes.css';

// Página enciclopédica de un personaje individual (estilo Wikipedia)
// Secciones: historia y origen, universo, rasgos de personalidad,
// producciones, actores, análisis e impacto cultural
function CharacterDetailPage() {
  const { id } = useParams()
  return (
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
}

export default CharacterDetailPage
