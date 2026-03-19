import { useLocation } from 'react-router-dom';
import '../../assets/styles/SearchPage.css';

//---------------------
import remyImg from '../../assets/images/remy.jpg';
import mulanImg from '../../assets/images/mulan.jpg';
import rapuncelImg from '../../assets/images/rapuncel.jpg';
//---------------------
function SearchPage() {
  // 1. Obtenemos la URL actual
  const location = useLocation();
  
  // 2. Extraemos el parámetro "query" de la URL
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('query') || "";

  const personajes = [
    { id: 1, nombre: 'RAPUNCEL', tipo: 'ENFP', universo: 'Universo Disney', img: rapuncelImg },
    { id: 2, nombre: 'REMY', tipo: 'ENFP', universo: 'Universo Disney', img: remyImg },
    { id: 3, nombre: 'MULÁN', tipo: 'ISTP', universo: 'Universo Disney', img: mulanImg },
    // ... agrega más personajes aquí
  ];

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