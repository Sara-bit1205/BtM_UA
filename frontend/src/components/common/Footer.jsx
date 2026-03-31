/*Este Footer es el pie de página de la aplicación y sirve para mostrar
 información básica y enlaces de navegación importantes. Está dividido 
 en tres partes: una sección de marca con el nombre y lema, un bloque
  de enlaces organizado en columnas (para escritorio) o en acordeón 
  (para móvil, usando Bootstrap), y una línea inferior con el copyright 
  dinámico. Utiliza Link de React Router para navegar sin recargar la 
  página y adapta su diseño según el tamaño de pantalla, ofreciendo una 
  experiencia*/
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        {/* Marca */}
        <div className="footer-brand">
          <span className="footer-logo">BtM</span>
          <p className="footer-tagline">Descubre la personalidad detrás del personaje</p>
        </div>

        {/* Columnas de enlaces — desktop */}
        <div className="footer-links d-none d-sm-flex">
          <div className="footer-col">
            <h4 className="footer-col-title">Explorar</h4>
            <Link to="/categorias" className="footer-link">Categorías</Link>
            <Link to="/tipos-personalidad" className="footer-link">Tipos de personalidad</Link>
            <Link to="/test-personalidad" className="footer-link">Test MBTI</Link>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Información</h4>
            <Link to="/que-es-btm" className="footer-link">¿Qué es BtM?</Link>
            <Link to="/sobre-nosotros" className="footer-link">Sobre Nosotros</Link>
            <Link to="/politica-privacidad" className="footer-link">Política de Privacidad</Link>
          </div>
        </div>

        {/* Acordeones móvil */}
        <div className="footer-accordion accordion d-sm-none w-100" id="footerAccordion">

          <div className="accordion-item">
            <h2 className="accordion-header" id="footerHeading1">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#footerCollapse1"
                aria-expanded="false"
                aria-controls="footerCollapse1"
              >
                Explorar
              </button>
            </h2>
            <div id="footerCollapse1" className="accordion-collapse collapse" aria-labelledby="footerHeading1" data-bs-parent="#footerAccordion">
              <div className="accordion-body d-flex flex-column gap-2">
                <Link to="/categorias" className="footer-link">Categorías</Link>
                <Link to="/tipos-personalidad" className="footer-link">Tipos de personalidad</Link>
                <Link to="/test-personalidad" className="footer-link">Test MBTI</Link>
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="footerHeading2">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#footerCollapse2"
                aria-expanded="false"
                aria-controls="footerCollapse2"
              >
                Información
              </button>
            </h2>
            <div id="footerCollapse2" className="accordion-collapse collapse" aria-labelledby="footerHeading2" data-bs-parent="#footerAccordion">
              <div className="accordion-body d-flex flex-column gap-2">
                <Link to="/que-es-btm" className="footer-link">¿Qué es BtM?</Link>
                <Link to="/sobre-nosotros" className="footer-link">Sobre Nosotros</Link>
                <Link to="/politica-privacidad" className="footer-link">Política de Privacidad</Link>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Línea inferior */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Behind The Mask — Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer
