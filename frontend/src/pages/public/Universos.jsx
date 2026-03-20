import React from 'react';

const UNIVERSOS_DATA = [
  {
    categoria: 'Marvel',
    personajes: [
      { id: 1, nombre: 'Tony Stark', mbti: 'ENTP', imagen: 'https://picsum.photos/seed/stark/300/300' },
      { id: 2, nombre: 'Steve Rogers', mbti: 'ISFJ', imagen: 'https://picsum.photos/seed/rogers/300/300' },
      { id: 3, nombre: 'Natasha Romanoff', mbti: 'ISTP', imagen: 'https://picsum.photos/seed/natasha/300/300' },
      { id: 4, nombre: 'Peter Parker', mbti: 'ENFP', imagen: 'https://picsum.photos/seed/peter/300/300' },
      { id: 5, nombre: 'Bruce Banner', mbti: 'INTP', imagen: 'https://picsum.photos/seed/bruce/300/300' },
    ]
  },
  {
    categoria: 'Disney',
    personajes: [
      { id: 6, nombre: 'Elsa', mbti: 'INFJ', imagen: 'https://picsum.photos/seed/elsa/300/300' },
      { id: 7, nombre: 'Mulan', mbti: 'ISTP', imagen: 'https://picsum.photos/seed/mulan/300/300' },
      { id: 8, nombre: 'Simba', mbti: 'ENFP', imagen: 'https://picsum.photos/seed/simba/300/300' },
    ]
  }
];

function Universos() {
  return (
    <div className="container mt-5 pt-4 mb-5">
      {/* Título principal de la página */}
      <div className="mb-5">
        <h1 className="home-section-title">Universos</h1>
      </div>

      {UNIVERSOS_DATA.map((seccion) => (
        <div key={seccion.categoria} className="mb-5">
          
          {/* Cabecera de la fila (estilo tienda: Título a la izquierda, "Ver más" a la derecha) */}
          <div className="d-flex justify-content-between align-items-end mb-3 px-2">
            <h3 className="m-0" style={{ color: 'var(--color4)', fontFamily: 'var(--texto-encabezados)', fontWeight: 'bold' }}>
              {seccion.categoria}
            </h3>
            <a href="#" className="text-decoration-none" style={{ color: 'var(--colorTexto)', fontSize: '0.9rem' }}>
              Ver más <i className="bi bi-arrow-right"></i>
            </a>
          </div>

          {/* Fila deslizable horizontalmente (El equivalente a tu captura) */}
          <div 
            className="d-flex flex-nowrap overflow-x-auto gap-3 py-3 px-2"
            style={{ scrollBehavior: 'smooth' }}
          >
            {seccion.personajes.map((personaje) => (
              
              /* Tarjeta individual (Ancho fijo para que se vean en fila) */
              <div 
                key={personaje.id} 
                className="card border-0 flex-shrink-0" 
                style={{ 
                  width: '240px', /* Ancho de la tarjeta estilo e-commerce */
                  backgroundColor: 'var(--color-principal)',
                  border: '2px solid var(--color-grisOscuro) !important',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 8px 15px rgba(0,0,0,0.2)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                
                {/* Imagen del personaje */}
                <img 
                  src={personaje.imagen} 
                  alt={personaje.nombre}
                  className="card-img-top p-3"
                  style={{ 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '20px' // Redondeamos la imagen un poco por dentro
                  }} 
                />

                {/* Cuerpo de la tarjeta (Textos) */}
                <div className="card-body d-flex flex-column pt-0">
                  
                  {/* Etiqueta MBTI (Como si fuera la etiqueta naranja de "Trending" en tu foto) */}
                  <span 
                    className="align-self-start mb-2 px-2 py-1 rounded-1" 
                    style={{ 
                      backgroundColor: 'var(--color5)', 
                      color: 'var(--color-principal)', 
                      fontSize: '0.8rem',
                      fontWeight: 'bold' 
                    }}
                  >
                    {personaje.mbti}
                  </span>

                  {/* Nombre del personaje */}
                  <h5 className="card-title m-0" style={{ color: 'var(--color3)', fontFamily: 'var(--texto-encabezados)' }}>
                    {personaje.nombre}
                  </h5>

                  {/* Un pequeño extra para imitar las opiniones de la foto */}
                  <div className="mt-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    <i className="bi bi-star-fill text-warning"></i> 4,8/5
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

export default Universos;