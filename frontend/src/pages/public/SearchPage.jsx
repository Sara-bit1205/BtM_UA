import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../assets/styles/SearchPage.css';


//---------------------
import remyImg from '../../assets/images/remy.jpg';
import mulanImg from '../../assets/images/mulan.jpg';
import rapuncelImg from '../../assets/images/rapuncel.jpg';
//---------------------
function SearchPage() {
  // 1. Obtenemos la URL actual
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  // 2. Extraemos el parámetro "query" de la URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('query') || "";

  const [personajes, setPersonajes] = useState([]);

  useEffect(() => {
  const fetchPersonajes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('characters')
      .select(`
        _id,
        name,
        coverImage,
      `);

    if (error) {
      console.error(error);
    } else {
      const adaptados = data.map(c => ({
        id: c._id,
        nombre: c.name,
        tipo: c.mbti_types?.code || 'N/A',
        universo: c.character_universe_categories
          ?.map(uc => uc.universe_categories?.universes?.name)
          .filter(Boolean)
          .join(', ') || 'Desconocido',
        img: c.cover_image
      }));
      setPersonajes(adaptados);
    }

    setLoading(false);
  };

  fetchPersonajes();
}, []);

  // 3. Filtramos los personajes basándonos en el nombre
  const personajesFiltrados = personajes.filter(p => {
    const busqueda = searchTerm.toLowerCase();
    
    return (
      p.nombre.toLowerCase().includes(busqueda) || 
      p.universo.toLowerCase().includes(busqueda) || 
      p.tipo.toLowerCase().includes(busqueda)
    );
  });

  return (
    <main className="search-container">
      <header className="search-header">
        <h2 className="filter-title">
          Filtrando por: <span className="highlight">{searchTerm || "Todos"}</span>
        </h2>
        <p className="results-count">{personajesFiltrados.length} resultados</p>
      </header>

      <div className="container">
        <div className="row g-4 justify-content-center">
          {personajesFiltrados.length > 0 ? (
            personajesFiltrados.map((p) => (
                <div key={p.id} className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center">                <div className="card character-card">
                  <div className="card-img-wrapper">
                    <img src={p.img} className="card-img-top" alt={p.nombre} />
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="character-name">{p.nombre}</h5>
                      <span className="character-type">{p.tipo}</span>
                    </div>
                    <p className="character-universe">{p.universo}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center mt-5">
              <p className="text-white">No se encontraron personajes con "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      <button className="btn-back" onClick={() => window.history.back()}>
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>
    </main>
  );
}

export default SearchPage;