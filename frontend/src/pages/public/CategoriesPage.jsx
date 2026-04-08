// Página de categorías: por Universo, Personalidad o Tipo MBTI
// Cada categoría incluye descripción, personajes populares y listado completoç
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function getRelationValue(relation, field){
  if(Array.isArray(relation)){
    return relation[0]?.[field];
  }
  return relation?.[field];
}

// Función para obtener la URL pública de una imagen almacenada en Supabase Storage
function getCharacterCoverUrl(coverPath) {
  if (!coverPath) return null;

  const { data } = supabase.storage.from('character-covers').getPublicUrl(coverPath);

  return data.publicUrl;
}

// Función para obtener la URL pública de una imagen almacenada en Supabase Storage
function getUniverseImageUrl(coverPath) {
  if (!coverPath) return null;

  const { data } = supabase.storage.from('universes_images').getPublicUrl(coverPath);

  return data.publicUrl;
}

// 1. El estado que controla qué número de personaje estamos viendo (empezamos en el 0)
function CategoriesPage() {
  
  const { universo } = useParams();
  const navigate = useNavigate();

  //Estos son los estados que van a controlar los datos que cargamos y su estado de carga
  const [Data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [personajeActual, setPersonajeActual] = useState(0);

  //Estos son los personajes populares que vamos a mostrar en el carrusel (puedes cargarlos dinámicamente también)

  useEffect ( () => {

    const loadingData = async () => {

      try {

        // Iniciamos la carga del universo con su descripcion y su imagen
        setLoadingData(true);

        const { data, error } = await supabase
          .from('universes')
          .select(`name, 
            description, 
            image_path, 
            characters (
              name, 
              slug, 
              cover_path, 
              mbti_types (code))`)
          .eq('name', universo)
          .single(); // <-- Usamos .single() porque esperamos un solo universo

          if (error) throw error;

          // Aquí si no hay datos lo comprobamos
          if (!data || data.length === 0) {
            setData([]);
            return;
          }

          // Lo que vamos a hacer ahora es transformar o poner los datos para poderlos mostrar
          const transformedData ={
            name: data.name,
            description: data.description,
            imageUrl: getUniverseImageUrl(data.image_path),
            characters: data.characters.map(character => ({
              id: character.slug, // Usamos slug como ID único
              name: character.name,
              slug: character.slug,
              coverUrl: character.cover_path ? getCharacterCoverUrl(character.cover_path) : null,
              mbtiType: getRelationValue(character.mbti_types, 'code') // Suponiendo que quieres el código del MBTI
            }))
          }

          setData(transformedData);

      }catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoadingData(false);
      }

    }
    loadingData();
  } , [universo]); // <-- El efecto se vuelve a ejecutar cada vez que cambia el universo seleccionado

  // Funciones del carrusel (asegúrate de que Data.characters existe antes de usarlas)
  const irAlSiguiente = () => {
    if (Data && Data.characters) {
      setPersonajeActual((prev) => (prev + 1) % Data.characters.length);
    }
  };

  const irAlAnterior = () => {
    if (Data && Data.characters) {
      setPersonajeActual((prev) => (prev - 1 + Data.characters.length) % Data.characters.length);
    }
  };

  return (
    // Contenedor principal oscuro
    <div className="container-fluid pb-5" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      
      <div className="row justify-content-center pt-4">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* --- BLOQUE 1: CABECERA (HERO) --- */}
          {loadingData ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : Data ? ( 
            <>
              {/* --- BLOQUE 1: CABECERA (HERO) --- */}
              <div 
                className="p-4 mb-4" 
                style={{ backgroundColor: 'var(--color-grisOscuro)', borderRadius: '20px' }}
              >
                <div className="text-center mb-4">
                  <img 
                    src={Data.imageUrl} // <-- Usamos la imagen del estado Data
                    alt={Data.name}
                    className="img-fluid shadow"
                    style={{ 
                      borderRadius: '30px', 
                      border: '6px solid var(--color1)', 
                      maxHeight: '300px',
                      objectFit: 'cover'
                    }} 
                  />
                </div>

                <h1 
                  style={{ 
                    fontFamily: 'var(--texto-encabezados)', 
                    color: 'var(--color1)', 
                    fontSize: '3rem', 
                    textTransform: 'uppercase',
                    margin: 0
                  }}
                >
                  {Data.name} {/* <-- Usamos el nombre del estado Data */}
                </h1>
                <h4 style={{ color: 'var(--color1)', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Categoría
                </h4>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6', textAlign: 'justify' }}>
                  {Data.description || 'Descripción no disponible.'} {/* <-- Usamos la descripción del estado Data */}
                </p>
              </div>

              {/* Si hay personajes, mostramos los bloques 2 y 3 */}
              {Data.characters && Data.characters.length > 0 && (
                <>
                  {/* --- BLOQUE 2: PERSONAJES POPULARES (Carrusel) --- */}
                  <h3 
                    className="mb-4 ps-3" 
                    style={{ color: 'var(--color1)', fontFamily: 'var(--texto-encabezados)', borderLeft: '5px solid var(--color1)' }}
                  >
                    PERSONAJES POPULARES
                  </h3>

                  <div 
                    className="d-flex justify-content-center align-items-center mb-5 position-relative overflow-hidden" 
                    style={{ height: '350px', width: '100%' }}
                  >
                    <button onClick={irAlAnterior} className="btn text-white position-absolute start-0 z-3 fs-1 border-0" style={{ padding: '0 10px' }}>
                      <i className="bi bi-chevron-left"></i>
                    </button>
                    
                    {Data.characters.map((personaje, index) => { // <-- Iteramos sobre Data.characters
                      let distancia = index - personajeActual;
                      if (personajeActual === 0 && index === Data.characters.length - 1) distancia = -1;
                      if (personajeActual === Data.characters.length - 1 && index === 0) distancia = 1;

                      let estilosAnimados = {};
                      if (distancia === 0) estilosAnimados = { transform: 'translateX(0) scale(1)', zIndex: 3, opacity: 1, filter: 'brightness(1)' };
                      else if (distancia === 1) estilosAnimados = { transform: 'translateX(45%) scale(0.85)', zIndex: 2, opacity: 0.6, filter: 'brightness(0.5)' };
                      else if (distancia === -1) estilosAnimados = { transform: 'translateX(-45%) scale(0.85)', zIndex: 2, opacity: 0.6, filter: 'brightness(0.5)' };
                      else estilosAnimados = { transform: 'translateX(0) scale(0.5)', zIndex: 1, opacity: 0, pointerEvents: 'none' };

                      return (
                        <div 
                          key={personaje.id}
                          className="text-center p-3 position-absolute" 
                          onClick={() => {
                            if (distancia === 1) irAlSiguiente();
                            if (distancia === -1) irAlAnterior();
                          }}
                          style={{ 
                            backgroundColor: 'var(--color-grisOscuro)', borderRadius: '30px', width: '60%', maxWidth: '300px',
                            boxShadow: distancia === 0 ? '0 10px 20px rgba(0,0,0,0.5)' : 'none',
                            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)', cursor: distancia === 0 ? 'default' : 'pointer',
                            ...estilosAnimados
                          }}
                        >
                          <h5 style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)' }}>{personaje.name}</h5>
                          <img src={personaje.coverUrl} alt={personaje.name} className="img-fluid my-2" style={{ height: '200px', objectFit: 'contain' }} />
                          <div className="mt-2" style={{ opacity: distancia === 0 ? 1 : 0, transition: 'opacity 0.2s' }}>
                            <span className="text-decoration-none fw-bold" style={{ color: 'var(--color1)' }}>
                              <i className="bi bi-circle-fill" style={{ fontSize: '0.5rem', verticalAlign: 'middle', marginRight: '5px' }}></i>
                              Saber más
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <button onClick={irAlSiguiente} className="btn text-white position-absolute end-0 z-3 fs-1 border-0" style={{ padding: '0 10px' }}>
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>

                  {/* --- BLOQUE 3: EXPLORA MÁS PERSONAJES (Lista) --- */}
                  <h3 
                    className="mb-4 ps-3" 
                    style={{ color: 'var(--color1)', fontFamily: 'var(--texto-encabezados)', borderLeft: '5px solid var(--color1)' }}
                  >
                    EXPLORA MÁS PERSONAJES
                  </h3>

                  <div className="d-flex flex-column gap-3">
                    {Data.characters.map((personaje) => ( // <-- Iteramos sobre Data.characters
                      <div key={personaje.id} className="d-flex p-2" style={{ backgroundColor: 'var(--color-grisOscuro)', borderRadius: '20px' }}>
                        <div className="position-relative" style={{ minWidth: '120px' }}>
                          <img src={personaje.coverUrl} alt={personaje.name} style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '15px' }} />
                          <div className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-2 fw-bold" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', border: '2px solid white', fontSize: '0.9rem' }}>
                            {personaje.mbtiType}
                          </div>
                        </div>
                        <div className="ms-3 d-flex flex-column justify-content-center py-2 pe-2">
                          <h4 className="m-0 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)' }}>{personaje.name}</h4>
                          <div className="mt-auto">
                            <span className="text-decoration-none fw-bold" style={{ color: 'var(--color1)' }}>
                              <i className="bi bi-circle-fill" style={{ fontSize: '0.5rem', verticalAlign: 'middle', marginRight: '5px' }}></i>
                              Saber más
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-5 mb-3">
                <button onClick={() => navigate(-1)} className="btn border-0 p-0" style={{ color: 'var(--color1)' }}>
                  <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '2.5rem' }}></i>
                </button>
              </div>
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <p className="text-muted">No se encontraron datos para este universo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
