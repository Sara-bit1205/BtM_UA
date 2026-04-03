import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../assets/styles/SearchPage.css';

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('query') || "";

  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [personajes, setPersonajes] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(queryParams.get('openFilters') === 'true');
  
  // Estados de selección de filtros
  const [filtroUniverso, setFiltroUniverso] = useState("");
  const [filtroMBTI, setFiltroMBTI] = useState("");
  const [filtroTag, setFiltroTag] = useState("");

  // Control de submenús abiertos
  const [menuAbierto, setMenuAbierto] = useState(null); 

  // --- 1. EFECTOS: Eventos de Navbar y URL ---
  useEffect(() => {
    const handleToggle = () => setMostrarFiltros(prev => !prev);
    window.addEventListener('toggle-search-filters', handleToggle);
    
    if (queryParams.get('openFilters') === 'true') {
      queryParams.delete('openFilters');
      navigate({ search: queryParams.toString() }, { replace: true });
    }
    return () => window.removeEventListener('toggle-search-filters', handleToggle);
  }, [location.search, navigate]);

  // --- 2. EFECTOS: Carga de Datos ---
  useEffect(() => {
    const fetchPersonajes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('characters')
        .select(`
          id,
          name,
          cover_path,
          universes ( name ),
          mbti_types ( code ),
          character_personality_tags ( personality_tags ( name ) )
        `);

      if (error) {
        console.error("Error cargando personajes:", error);
      } else {
        const adaptados = data.map(c => ({
          id: c.id,
          nombre: c.name,
          tipo: c.mbti_types?.code || 'N/A',
          universo: c.universes?.name || 'Desconocido',
          img: c.cover_path,
          tags: c.character_personality_tags?.map(t => t.personality_tags.name) || []
        }));
        setPersonajes(adaptados);
      }
      setLoading(false);
    };

    fetchPersonajes();
  }, []);

  // --- 3. LÓGICA DE FILTRADO ---
  const personajesFiltrados = personajes.filter(p => {
    const busqueda = searchTerm.toLowerCase();
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda) || 
                             p.universo.toLowerCase().includes(busqueda) || 
                             p.tipo.toLowerCase().includes(busqueda);

    const coincideUniverso = !filtroUniverso || p.universo === filtroUniverso;
    const coincideMBTI = !filtroMBTI || p.tipo === filtroMBTI;
    const coincideTag = !filtroTag || p.tags.includes(filtroTag);

    return coincideBusqueda && coincideUniverso && coincideMBTI && coincideTag;
  });

  const toggleSubMenu = (menu) => setMenuAbierto(menuAbierto === menu ? null : menu);

  // Datos para los listados (basados en tus Inserts)
  const universos = ['Marvel', 'DC', 'Disney', 'Dreamworks'];
  const mbtis = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  const tags = ['Alegre', 'Melancólico', 'Agresivo', 'Misterioso', 'Valiente', 'Sabio', 'Noble', 'Astuto', 'Leal', 'Juguetón', 'Manipuladora', 'Vengativa', 'Orgullosa', 'Dominante', 'Ambiciosa', 'Sarcástica', 'Calculadora', 'Envidioso'];

  return (
    <main className="search-container">
      <header className="search-header text-center mb-5">
        <h2 className="filter-title">
          {searchTerm ? (
            <>Filtrando por: <span className="highlight">"{searchTerm}"</span></>
          ) : (
            "Todos los personajes"
          )}
        </h2>
        <p className="results-count text-secondary">
          {loading ? "Cargando..." : `${personajesFiltrados.length} resultados encontrados`}
        </p>
      </header>

      {/* --- POPUP DE FILTROS --- */}
      <div className={`filter-popup-overlay ${mostrarFiltros ? 'show' : ''}`} onClick={() => setMostrarFiltros(false)}>
        <div className="filter-box" onClick={e => e.stopPropagation()}>
          <div className="filter-header">
            <h5>Filtrar Por:</h5>
            <button className="btn-toggle-filter" onClick={() => setMostrarFiltros(false)}>
              <i className="bi bi-chevron-up"></i>
            </button>
          </div>

          <div className="filter-body">
            {/* UNIVERSO */}
            <div className="filter-item" onClick={() => toggleSubMenu('universo')}>
              <p>Por universo</p>
              <i className={`bi bi-chevron-${menuAbierto === 'universo' ? 'up' : 'down'}`}></i>
            </div>
            {menuAbierto === 'universo' && (
              <ul className="custom-filter-list">
                <li className={filtroUniverso === "" ? 'active' : ''} onClick={() => setFiltroUniverso("")}>Todos</li>
                {universos.map(u => (
                  <li key={u} className={filtroUniverso === u ? 'active' : ''} onClick={() => setFiltroUniverso(u)}>{u}</li>
                ))}
              </ul>
            )}

            {/* PERSONALIDAD MBTI */}
            <div className="filter-item" onClick={() => toggleSubMenu('mbti')}>
              <p>Por personalidad (MBTI)</p>
              <i className={`bi bi-chevron-${menuAbierto === 'mbti' ? 'up' : 'down'}`}></i>
            </div>
            {menuAbierto === 'mbti' && (
              <ul className="custom-filter-list grid-list">
                <li className={filtroMBTI === "" ? 'active' : ''} onClick={() => setFiltroMBTI("")}>Todos</li>
                {mbtis.map(m => (
                  <li key={m} className={filtroMBTI === m ? 'active' : ''} onClick={() => setFiltroMBTI(m)}>{m}</li>
                ))}
              </ul>
            )}

            {/* PSICOLOGÍA TAGS */}
            <div className="filter-item border-0" onClick={() => toggleSubMenu('psicologia')}>
              <p>Por psicología</p>
              <i className={`bi bi-chevron-${menuAbierto === 'psicologia' ? 'up' : 'down'}`}></i>
            </div>
            {menuAbierto === 'psicologia' && (
              <ul className="custom-filter-list scrollable-list">
                <li className={filtroTag === "" ? 'active' : ''} onClick={() => setFiltroTag("")}>Todos</li>
                {tags.map(t => (
                  <li key={t} className={filtroTag === t ? 'active' : ''} onClick={() => setFiltroTag(t)}>{t}</li>
                ))}
              </ul>
            )}
          </div>

          <button className="btn-aplicar-filtros" onClick={() => setMostrarFiltros(false)}>LISTO</button>
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="container">
        {loading ? (
          <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>
        ) : (
          <div className="row g-4 justify-content-center">
            {personajesFiltrados.length > 0 ? (
              personajesFiltrados.map((p) => (
                <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                  <div className="card character-card h-100">
                    <div className="card-img-wrapper">
                      <img src={p.img} className="card-img-top" alt={p.nombre} loading="lazy" />
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="character-name m-0">{p.nombre}</h5>
                        <span className="badge bg-primary character-type">{p.tipo}</span>
                      </div>
                      <p className="character-universe text-secondary small mb-0">{p.universo}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center mt-5">
                <p className="text-white">No hay coincidencias.</p>
                <button className="btn btn-outline-light btn-sm" onClick={() => { setFiltroUniverso(""); setFiltroMBTI(""); setFiltroTag(""); }}>Limpiar filtros</button>
              </div>
            )}
          </div>
        )}
      </div>

      <button className="btn-back" onClick={() => navigate(-1)}><i className="bi bi-arrow-left-circle-fill"></i></button>
    </main>
  );
}

export default SearchPage;