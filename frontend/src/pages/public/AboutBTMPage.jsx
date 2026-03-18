import '../../assets/styles/comunInfo.css'; 

function AboutBTMPage() {
  return (
    <main className="about-container">
      <div className="about-card">
        <h1 className="about-title">¿QUÉ ES BEHIND THE MASK?</h1>
        
        <div className="about-content">
          <p>
            Nuestra plataforma está dedicada a explorar y recopilar 
            información sobre una amplia variedad de personajes, 
            tanto ficticios como reales. Ofrecemos datos relevantes 
            como información general, actores o actrices que los han 
            interpretado, origen, fecha de creación y otros detalles 
            de interés.
          </p>

          <p>
            Lo que nos distingue es nuestro exclusivo 
            análisis de personalidad aplicado a cada personaje, 
            además de una colección de imágenes, canciones asociadas
            y contenido adicional cuidadosamente seleccionado.
          </p>

          <p>
            Si estás buscando una plataforma completa 
            donde puedas encontrar información detallada 
            sobre cualquier personaje, te invitamos a descubrir 
            todo lo que tenemos para ofrecer.
          </p>
        </div>

        <button className="btn-back" onClick={() => window.history.back()}>
          <i className="bi bi-arrow-left-circle-fill"></i>
        </button>
      </div>
    </main>
  )
}

export default AboutBTMPage;