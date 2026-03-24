// Pie de página con enlaces a Sobre Nosotros y Política de Privacidad
import { Link } from 'react-router-dom'
function Footer() {
  return (
    <footer className="footer">
      <div className="container-fluid d-flex align-items-center justify-content-between gap-2">
        <Link to="/sobre-nosotros" className="text-decoration-none  sobreNosotros">Sobre Nosotros</Link>
        <p>© Behind The Mask</p>
        <Link to="/politica-privacidad" className="text-decoration-none  politicas">Política de Privacidad</Link>
      </div>
      
    </footer>
  )
}

export default Footer
