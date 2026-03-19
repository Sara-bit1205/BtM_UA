import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import StylePanel from './StylePanel';

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  // Manejador del envío del formulario (al pulsar Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Enviamos el término a la URL: /busqueda?query=Batman
      navigate(`/busqueda?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Limpiamos el buscador después de navegar
    }
  };

  return (
    <>
    <nav className="navBar">
      <div className="container-fluid d-flex align-items-center justify-content-between gap-2">

        {/* Logo - Envuelto en Link para volver al inicio */}
        <div className="navBarLogo d-flex align-items-center justify-content-center">
          <Link to="/">
            <img src={logo} alt="Behind The Mask" className="navBarLogo-img" />
          </Link>
        </div>

        {/* Buscador - Envuelto en FORM para capturar el ENTER */}
        <form className="navBarSearch flex-grow-1" onSubmit={handleSubmit}>
          <div className="input-group">
            <Link className="nav-link" to="/busqueda">
              <span className="input-group-text navBar__search-icon">
                <i className="bi bi-search"></i>
              </span>
            </Link>
            <input 
              type="text" 
              className="form-control navBar__input" 
              placeholder="Buscar personaje..." 
              aria-label="Buscar personaje"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>

        {/* Iconos derecha */}
        <div className="navBarActions d-flex align-items-center gap-3">
          <button type="button" className="btnFilter" aria-label="Filtrar">
            <i className="bi bi-funnel-fill"></i>
          </button>

          {/*Botón para abrir panel de estilos*/}
          <button type="button" className="btnStyle" aria-label="Cambiar estilo" aria-expanded={isStylePanelOpen} aria-controls="stylePanel" onClick={() => setIsStylePanelOpen(prev => !prev)}>
            <i className="bi bi-brush"></i>
          </button>

          {/* Enlace dinámico al Perfil o Login */}
          <Link 
            to={user ? (user.role === 'admin' ? '/admin' : '/perfil') : '/login'} 
            className="profile-link"
          >
            <button type="button" className="btnUser" aria-label="Perfil">
              <i className="bi bi-person-circle"></i>
            </button>
          </Link>

          <button type="button" className="btnMenu navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Menú">
            <i className="bi bi-list"></i>
          </button>
          
        </div>
      </div>
    </nav>

    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="offcanvasNavbarLabel">
            MENÚ
          </h3>
          <button type="button"  className="btn-close"  data-bs-dismiss="offcanvas"  aria-label="Cerrar"></button>
        </div>
        <li><hr className="divider-thick" /></li>
        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <Link className="nav-link" to="/que-es-btm">
              <li className="nav-item">
                <p>Qué es BtM?</p>
              </li>
            </Link>
            <li><hr className="divider-thick" /></li>
            <Link className="nav-link" to="/test-personalidad">
              <li className="nav-item">
                <p>Test de Personalidad (MBTI)</p>
              </li>
            </Link>
            <li><hr className="divider-thick" /></li>
          </ul>
        </div>
    </div>
    <div id="style-panel">
        <StylePanel isOpen={isStylePanelOpen} onClose = {() => setIsStylePanelOpen(false)} />
    </div>
    </>
  );
}

export default Navbar;