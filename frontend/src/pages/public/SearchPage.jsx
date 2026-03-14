import '../../assets/styles/SearchPage.css'

function SearchPage() {
  const personajes = [
    { id: 1, nombre: 'RAPUNCEL', tipo: 'ENFP', universo: 'Universo Disney', img: 'url_a_rapunzel' },
    { id: 2, nombre: 'REMY', tipo: 'ENFP', universo: 'Universo Disney', img: 'url_a_remy' },
    // ... más datos
  ];

  return (
    <main className="search-container">
      <header className="search-header">
        <h2 className="filter-title">Filtrando por: <span className="highlight">Disney</span></h2>
        <p className="results-count">100 resultados</p>
      </header>

      <div className="container">
        <div className="row g-4 justify-content-center">
          {personajes.map((p) => (
            <div key={p.id} className="col-6 col-md-4 col-lg-3 d-flex justify-content-center">
              
              {/* TARJETA PERSONALIZADA */}
              <div className="card character-card">
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
          ))}
        </div>
      </div>

      <button className="btn-back">
        <i className="bi bi-arrow-left-circle-fill"></i>
      </button>
    </main>
  );
}

export default SearchPage;