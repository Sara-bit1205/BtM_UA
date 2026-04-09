import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useParams } from 'react-router-dom';

//-------Helpers-------

// Función para obtener el valor de una relación, ya sea un objeto o un array
// La voy utilizare para obtener el nombre del universo
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

function Clasificador() {
  // Aquí lo que vamos a hacer es poner los datos estatícos que vamos a cargar en la página

  const { categoria } = useParams();

  const [Data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {

    const loadingData = async () => {
      try {
        //Iniciamos la carga de los personajes con su universo y su tipo de MBTI
        setLoadingData(true);

        const { data, error } = await supabase
          .from('characters')
          .select(`
            name,               
            slug,                   
            cover_path,         
            universes (name),  
            mbti_types (code, title)  
          `);

          if (error) throw error;

          //Aquí si no hay datos lo comprobamos
          if (!data || data.length === 0) {
            setData([]);
            return;
          }

          //Lo que vamos a hacer ahora es transformar o poner los datos para poderlos mostrar

          //--- Proceso seguido ---
          // 1. Creamos un objeto vacío donde vamos a agrupar los personajes por universo
          // 2. Recorremos los datos obtenidos en busca de los universos y los personajes
          // 3. Para cada personaje, obtenemos el nombre del universo al que pertenece
          // Si ese universo no existe se crea dentro del objeto con un array vacío 
          // y si ya existe, simplemente se añade el personaje a ese universo dentro del objeto
          // 4. Para cada personaje, también obtenemos su nombre, imagen y tipo de MBTI para mostrarlo en la tarjeta
          // 5. Al final, tendremos un objeto con la estructura { universo1: [personaje1, personaje2], universo2: [personaje3, personaje4], ... }
          const clasificacion = {};

          data.forEach((personaje) => {

            let name = null;

            switch (categoria) {
              case 'universos':
                 name = getRelationValue(personaje.universes, 'name');
                break;
              case 'personalidades':
                 name = getRelationValue(personaje.mbti_types, 'code');
                break;
              case 'psicologia':
                 name = getRelationValue(personaje.mbti_types, 'code');
                break;
              default:
                return; // Si el personaje no pertenece a ninguno de los universos que nos interesan, lo saltamos
            }

            if(!clasificacion[name]) clasificacion[name] = [];

            const personajeData = {
              id: personaje.slug, // Usamos el slug como ID único
              nombre: personaje.name,
              imagen: getCharacterCoverUrl(personaje.cover_path),
              mbti: getRelationValue(personaje.mbti_types, 'code')
            }

            clasificacion[name].push(personajeData);
          });
          
          // Una vez tengamos el objeto lo guardamos en nuestra variable de estado para mostrarlo en la página
          setData(Object.entries(clasificacion).map(([categoria, personajes]) => ({ categoria, personajes })));

      } catch (error) {
        console.error('Error al cargar de los datos', error);
      } finally {
        setLoadingData(false);
      }

    }

      loadingData();

  } , [categoria]);
  return (
    <div className="container mt-5 pt-4 mb-5">
  <div className="mb-5">
    <h1 className="home-section-title">
      {categoria === 'universos' ? 'Universos' : categoria === 'personalidades' ? 'Personalidades' : 'Psicología'}
    </h1>
  </div>

  {loadingData ? (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  ) : Data && Data.length > 0 ? (
    
    /* 1. PRIMER MAP: Recorremos los grupos (Ej: Marvel, Disney) */
    Data.map((grupo) => (
      <div key={grupo.categoria} className="mb-5">
        
        {/* Cabecera de la fila */}
        <div className="d-flex justify-content-between align-items-end mb-3 px-2">
          <h3 className="m-0" style={{ color: 'var(--color4)', fontFamily: 'var(--texto-encabezados)', fontWeight: 'bold' }}>
            {grupo.categoria} {/* <-- Usamos grupo.categoria */}
          </h3>
          <Link 
            to={`/categorias/${grupo.categoria}`}
            className="text-decoration-none d-flex align-items-center gap-1" 
            style={{ color: 'var(--colorTexto)', fontSize: '0.9rem' }}
          >
            Ver más <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {/* Contenedor Fila deslizable */}
        <div 
          className="d-flex flex-nowrap overflow-x-auto gap-3 py-3 px-2"
          style={{ scrollBehavior: 'smooth' }}
        >
            
          
          {grupo.personajes.map((personaje) => (
            <Link to={`/personaje/${personaje.id}`} className="text-decoration-none" key={personaje.id}>
              <div 
              key={personaje.id} 
              className="card border-0 flex-shrink-0" 
              style={{ 
                width: '240px',
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
                src={personaje.imagen} /* <-- Usamos personaje.imagen */
                alt={personaje.nombre}
                className="card-img-top p-3"
                style={{ 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '20px' 
                }} 
              />

              {/* Cuerpo de la tarjeta */}
              <div className="card-body d-flex flex-column pt-0">
                
                {/* Etiqueta MBTI */}
                <span 
                  className="align-self-start mb-2 px-2 py-1 rounded-1" 
                  style={{ 
                    backgroundColor: 'var(--color5)', 
                    color: 'var(--color-principal)', 
                    fontSize: '0.8rem',
                    fontWeight: 'bold' 
                  }}
                >
                  {personaje.mbti} {/* <-- Usamos personaje.mbti */}
                </span>

                {/* Nombre del personaje */}
                <h5 className="card-title m-0" style={{ color: 'var(--color3)', fontFamily: 'var(--texto-encabezados)' }}>
                  {personaje.nombre} {/* <-- Usamos personaje.nombre */}
                </h5>
                
              </div>

            </div>
            </Link>
            
          ))} {/* <-- Cierre del map de personajes */}
            
        </div>
      </div>
    )) /* <-- Cierre del map de grupos */
    
  ) : (
    <p>No hay personajes disponibles.</p>
  )}
</div>
  );
}

export default Clasificador;