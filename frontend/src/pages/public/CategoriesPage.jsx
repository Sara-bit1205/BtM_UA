// Página de categorías: por Universo, Personalidad o Tipo MBTI
// Cada categoría incluye descripción, personajes populares y listado completoç
import React from 'react';
import { useNavigate } from 'react-router-dom';

// Datos de prueba (Luego vendrán de Supabase)
const MARVEL_DATA = {
  titulo: 'MARVEL',
  descripcion: 'Marvel es un reconocido universo de ficción que tiene sus raíces en 1939. Impulsado por la inigualable creatividad de figuras como Stan Lee, sus historias de superhéroes lograron conquistar los corazones de jóvenes y adultos por igual, enseñándonos que un gran poder conlleva una gran responsabilidad. En este universo te encontrarás con héroes legendarios como Spider-Man, el Capitán América y muchos otros que han marcado la historia del cine y el cómic.',
  imagenPrincipal: 'https://picsum.photos/seed/marvel/400/400',
  personajesExplorar: [
    {
      id: 1,
      nombre: 'VENOM',
      descripcion: 'La oscura y brutal unión entre Eddie Brock y un simbionte alienígena. Fuerza sobrehumana y una moral retorcida.',
      mbti: 'ISFP',
      colorMbti: '#FFD700', // Amarillo
      imagen: 'https://picsum.photos/seed/venom/150/200'
    },
    {
      id: 2,
      nombre: 'DOCTOR STRANGE',
      descripcion: 'Un neurocirujano brillante pero arrogante que pierde su carrera en un trágico accidente automovilístico.',
      mbti: 'INTJ',
      colorMbti: '#00FA9A', // Verde
      imagen: 'https://picsum.photos/seed/strange/150/200'
    }
  ]
};

function CategoriesPage() {
  const navigate = useNavigate();

  return (
    // Contenedor principal oscuro
    <div className="container-fluid pb-5" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      
      <div className="row justify-content-center pt-4">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* --- BLOQUE 1: CABECERA (HERO) --- */}
          <div 
            className="p-4 mb-4" 
            style={{ 
              backgroundColor: 'var(--color-grisOscuro)', 
              borderRadius: '20px' 
            }}
          >
            {/* Imagen principal con borde grueso */}
            <div className="text-center mb-4">
              <img 
                src={MARVEL_DATA.imagenPrincipal} 
                alt={MARVEL_DATA.titulo}
                className="img-fluid shadow"
                style={{ 
                  borderRadius: '30px', 
                  border: '6px solid var(--color1)', // Ajusta a tu variable de color verde claro
                  maxHeight: '300px',
                  objectFit: 'cover'
                }} 
              />
            </div>

            {/* Textos de la cabecera */}
            <h1 
              style={{ 
                fontFamily: 'var(--texto-encabezados)', 
                color: 'var(--color1)', 
                fontSize: '3rem', 
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              {MARVEL_DATA.titulo}
            </h1>
            <h4 style={{ color: 'var(--color1)', fontWeight: 'bold', marginBottom: '1rem' }}>
              Categoría
            </h4>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify' }}>
              {MARVEL_DATA.descripcion}
            </p>
          </div>

          {/* --- BLOQUE 2: PERSONAJES POPULARES --- */}
          {/* Título de sección con barra lateral */}
          <h3 
            className="mb-4 ps-3" 
            style={{ 
              color: 'var(--color1)', 
              fontFamily: 'var(--texto-encabezados)', 
              borderLeft: '5px solid var(--color1)' 
            }}
          >
            PERSONAJES POPULARES
          </h3>

          {/* Aquí iría tu Carrusel. He puesto una tarjeta central destacada simulando tu diseño */}
          <div className="d-flex justify-content-center mb-5 position-relative">
            {/* Flecha izquierda */}
            <button className="btn text-white position-absolute start-0 top-50 translate-middle-y fs-1 border-0">
              <i className="bi bi-chevron-left"></i>
            </button>
            
            <div 
              className="text-center p-3" 
              style={{ 
                backgroundColor: 'var(--color-grisOscuro)', 
                borderRadius: '30px', 
                width: '70%',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5)'
              }}
            >
              <h5 style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)' }}>
                CAPITÁN AMÉRICA
              </h5>
              <img 
                src="https://picsum.photos/seed/cap/200/250" 
                alt="Capitán América" 
                className="img-fluid my-2" 
                style={{ height: '200px', objectFit: 'contain' }}
              />
              <div className="mt-2">
                <a href="#" className="text-decoration-none fw-bold" style={{ color: 'var(--color1)' }}>
                  <i className="bi bi-circle-fill" style={{ fontSize: '0.5rem', verticalAlign: 'middle', marginRight: '5px' }}></i>
                  Saber más
                </a>
              </div>
            </div>

            {/* Flecha derecha */}
            <button className="btn text-white position-absolute end-0 top-50 translate-middle-y fs-1 border-0">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>

          {/* --- BLOQUE 3: EXPLORA MÁS PERSONAJES (Lista) --- */}
          <h3 
            className="mb-4 ps-3" 
            style={{ 
              color: 'var(--color1)', 
              fontFamily: 'var(--texto-encabezados)', 
              borderLeft: '5px solid var(--color1)' 
            }}
          >
            EXPLORA MÁS PERSONAJES
          </h3>

          <div className="d-flex flex-column gap-3">
            {MARVEL_DATA.personajesExplorar.map((personaje) => (
              
              /* Tarjeta Horizontal de la Lista */
              <div 
                key={personaje.id} 
                className="d-flex p-2"
                style={{ 
                  backgroundColor: 'var(--color-grisOscuro)', 
                  borderRadius: '20px' 
                }}
              >
                {/* Imagen con etiqueta MBTI superpuesta */}
                <div className="position-relative" style={{ minWidth: '120px' }}>
                  <img 
                    src={personaje.imagen} 
                    alt={personaje.nombre} 
                    style={{ 
                      width: '120px', 
                      height: '160px', 
                      objectFit: 'cover', 
                      borderRadius: '15px' 
                    }} 
                  />
                  {/* Etiqueta MBTI Absoluta */}
                  <div 
                    className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-2 fw-bold"
                    style={{ 
                      backgroundColor: 'rgba(0,0,0,0.7)', 
                      color: personaje.colorMbti,
                      border: `2px solid ${personaje.colorMbti}`,
                      fontSize: '0.9rem'
                    }}
                  >
                    {personaje.mbti}
                  </div>
                </div>

                {/* Textos de la tarjeta */}
                <div className="ms-3 d-flex flex-column justify-content-center py-2 pe-2">
                  <h4 
                    className="m-0 text-uppercase" 
                    style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)' }}
                  >
                    {personaje.nombre}
                  </h4>
                  <p className="mt-2 mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>
                    {personaje.descripcion}
                  </p>
                  <div className="mt-auto">
                    <a href="#" className="text-decoration-none fw-bold" style={{ color: 'var(--color1)' }}>
                      <i className="bi bi-circle-fill" style={{ fontSize: '0.5rem', verticalAlign: 'middle', marginRight: '5px' }}></i>
                      Saber más
                    </a>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          {/* Botón Volver Atrás (Flecha inferior izquierda) */}
          <div className="mt-5 mb-3">
            <button 
              onClick={() => navigate(-1)} 
              className="btn border-0 p-0"
              style={{ color: 'var(--color1)' }}
            >
              <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '2.5rem' }}></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CategoriesPage
