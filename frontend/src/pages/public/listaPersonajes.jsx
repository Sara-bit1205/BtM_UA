import React from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Datos de prueba (Luego vendrán de Supabase)
const PERSONAJES_MOCK = [
  {
    id: 1,
    nombre: 'MALÉFICA',
    descripcion: 'Maléfica, conocida originalmente como la villana de La Bella Durmiente (1959), es...',
    imagen: 'https://picsum.photos/seed/malefica/150/150'
  },
  {
    id: 2,
    nombre: 'VENOM',
    descripcion: 'La oscura y brutal unión entre Eddie Brock y un simbionte alienígena. Fuerza sobrehumana y una moral retorcida.',
    imagen: 'https://picsum.photos/seed/venom/150/150'
  },
  {
    id: 3,
    nombre: 'RAPUNCEL',
    descripcion: 'Rapunzel es un personaje de cuento popular europeo, conocido principalmente por la versión recopilada por los Hermanos Grimm...',
    imagen: 'https://picsum.photos/seed/rapunzel/150/150'
  }
];

function listaPersonajes() {
  const navigate = useNavigate();

  return (
    // Contenedor principal oscuro
    <div className="container-fluid pb-5" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      
      <div className="row justify-content-center pt-4">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* --- TÍTULO --- */}
          <h1 
            className="text-center mb-3 text-uppercase" 
            style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)', fontSize: '2.5rem' }}
          >
            Lista de Personajes
          </h1>

          {/* --- BOTÓN CREAR NUEVO --- */}
          <div className="text-center mb-4">
            <button 
              className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 shadow"
              style={{ backgroundColor: '#5bc0be', color: '#000', border: '2px solid #4a9e9c' }} // Ese verde azulado de tu captura
              onClick={() => navigate('/formulario-personaje')}
            >
              CREAR NUEVO <i className="bi bi-plus-circle fs-5"></i>
            </button>
          </div>

          {/* --- LISTA DE TARJETAS --- */}
          <div className="d-flex flex-column gap-3 px-2">
            {PERSONAJES_MOCK.map((personaje) => (
              
              /* Tarjeta de Bootstrap adaptada a tu diseño */
              <div 
                key={personaje.id} 
                className="card border-0 p-3 shadow-sm"
                style={{ backgroundColor: 'var(--color-grisOscuro, #2a2a2a)', borderRadius: '25px' }}
              >
                {/* Usamos d-flex para poner foto a la izquierda y textos a la derecha */}
                <div className="d-flex align-items-start gap-3">
                  
                  {/* 1. Imagen cuadrada con bordes redondeados */}
                  <img 
                    src={personaje.imagen} 
                    alt={personaje.nombre}
                    className="bg-white" // Fondo blanco por si la imagen tiene transparencias (como Maléfica)
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      objectFit: 'cover', 
                      borderRadius: '15px' 
                    }}
                  />

                  {/* 2. Contenido (Título, Descripción y Botones) */}
                  <div className="d-flex flex-column flex-grow-1">
                    
                    <h3 
                      className="m-0 text-uppercase" 
                      style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)', fontSize: '1.5rem' }}
                    >
                      {personaje.nombre}
                    </h3>
                    
                    <p className="mt-1 mb-2" style={{ fontSize: '0.85rem', lineHeight: '1.3', color: '#e0e0e0' }}>
                      {personaje.descripcion}
                    </p>

                    {/* Contenedor de los botones Editar y Eliminar centrados bajo el texto */}
                    <div className="d-flex justify-content-center gap-3 mt-auto pt-2">
                      {/* Botón Editar (Verde Neón) */}
                      <button 
                        className="btn rounded-pill px-4"
                        style={{ backgroundColor: 'var(--color1)', border: '2px solid #85c249' }}
                        onClick={() => navigate('/formulario-personaje', { state: { personaje } })} // Aquí iría la función real de edición, pasando el ID del personaje
                      >
                        <i className="bi bi-pencil fs-5 text-dark"></i>
                      </button>
                      
                      {/* Botón Eliminar (Rosa Fucsia) */}
                      <button 
                        className="btn rounded-pill px-4"
                        style={{ backgroundColor: '#ff1493', border: '2px solid #c91074' }}
                        onClick={() => navigate('/eliminar-personaje', { state: { personaje } })} // Aquí iría la función real de eliminación
                      >
                        <i className="bi bi-trash fs-5 text-white"></i>
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            ))}
          </div>

          {/* --- BOTÓN VOLVER (Abajo a la izquierda) --- */}
          <div className="mt-4 ms-2">
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

export default listaPersonajes;