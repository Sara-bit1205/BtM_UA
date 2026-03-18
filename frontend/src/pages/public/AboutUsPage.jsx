import '../../assets/styles/comunInfo.css'; 

// Página "Sobre Nosotros" — quiénes somos y propósito del proyecto
function AboutUsPage() {
  return (
    <main className="about-container">
      <div className="about-card">
        <h1 className="about-title">SOBRE NOSOTROS</h1>
        
        <div className="about-content">
          <p>
            Somos Celia Fortea, Sara Díaz, Nicolás Flores y 
            Alvaro Millán, cuatro estudiantes de Ingeniería 
            Multimedia apasionados por el cine y el universo de 
            los personajes que lo hacen posible. Por eso decidimos 
            crear una página web dedicada a explorar y analizar a 
            nuestros personajes favoritos.
          </p>

          <p>
            Sin embargo, queríamos ir un paso más allá. 
            No solo queríamos hablar de sus historias o habilidades, 
            sino profundizar en lo que realmente los define: 
            su personalidad y su psicología. Nuestro objetivo es ofrecer 
            una perspectiva diferente, ayudando a las personas a 
            comprender mejor a los personajes desde un enfoque más 
            humano y reflexivo.

          </p>

          <p>
            Además, aprovechamos este espacio para dar a conocer 
            el test de personalidad MBTI, conectándolo con personajes 
            conocidos para que los usuarios puedan descubrir con cuál 
            se identifican y entender mejor su propio perfil.
          </p>
        </div>

        <button className="btn-back" onClick={() => window.history.back()}>
          <i className="bi bi-arrow-left-circle-fill"></i>
        </button>
      </div>
    </main>
  )
}

export default AboutUsPage
