import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { useAuth } from '../../context/AuthContext';
import StylePanel from './StylePanel';

// 1. Array actualizado con iconos de Bootstrap
const CATEGORIES = [
  { id: 'universos', name: 'Universos', icon: 'bi-globe' },
  { id: 'personalidades', name: 'Personalidades', icon: 'bi-people-fill' },
  { id: 'psicologia', name: 'Psicología', icon: 'bi-puzzle-fill' }, 
];

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
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
            {/* SOBRE */}
            <li className="menu-section">SOBRE BtM</li>

            <li className="nav-item">
              <Link className="nav-link" to="/que-es-btm">
                Qué es BtM
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/como-funciona">
                Cómo funciona
              </Link>
            </li>

            <li><hr className="divider-thick" /></li>

            {/* PERSONALIDAD */}
            <li className="menu-section">PERSONALIDAD</li>

            <li className="nav-item">
              <Link className="nav-link" to="/test-mbti">
                Test MBTI
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/tipos-mbti">
                Tipos de personalidad
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/metodo-test">
                Cómo se calcula
              </Link>
            </li>

            <li><hr className="divider-thick" /></li>

            {/* MULTIMEDIA */}
            <li className="menu-section">MULTIMEDIA</li>

            <li className="nav-item">
              <Link className="nav-link" to="/descargas">
                Descargas
              </Link>
            </li>

            <li><hr className="divider-thick" /></li>

            {/* Contenedor de los botones */}
            <div className="d-flex flex-column">
              {/* INYECTAMOS LOS ESTILOS CSS PARA LAS ANIMACIONES AQUÍ MISMO */}
            <style>
              {`
                .btn-categoria {
                  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                  border-radius: 12px !important;
                  margin-bottom: 8px;
                }
                /* Efecto al pasar el ratón (Hover) */
                .btn-categoria:hover {
                  transform: translateX(8px); /* Se desliza un poco a la derecha */
                  background-color: rgba(150, 150, 150, 0.15) !important;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                /* Efecto al hacer clic (Active) */
                .btn-categoria:active {
                  transform: scale(0.97) translateX(8px); /* Se encoge un poquito, como un botón físico */
                }
                /* Animación del icono principal */
                .btn-categoria .icono-cat {
                  transition: transform 0.3s ease;
                }
                .btn-categoria:hover .icono-cat {
                  transform: scale(1.15) rotate(5deg); /* El icono crece y gira un pelín */
                }
                /* Animación de la flecha de la derecha */
                .btn-categoria .flecha-cat {
                  transition: all 0.3s ease;
                }
                .btn-categoria:hover .flecha-cat {
                  transform: translateX(5px); /* La flecha indica movimiento */
                  opacity: 1 !important;
                }
              `}
            </style>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {setActiveCategory(cat.id);
                                  navigate(`/${cat.id}`); // Esto lo que hace es coger los nombres del array de categorías y navegar a la ruta correspondiente al hacer click en cada botón
                  }}
                  // 1. AQUÍ AÑADIMOS "btn-categoria" al className del botón
                  data-bs-dismiss="offcanvas" //Se añade para que cuando hagamos click encima se cierre la ventana lateral
                  className={`btn btn-categoria d-flex align-items-center w-100 text-start border-0 px-3 py-3 ${
                    activeCategory === cat.id ? 'bg-secondary bg-opacity-25' : 'bg-transparent'
                  }`}
                  style={{ color: 'inherit' }}
                >
                  {/* 2. AQUÍ AÑADIMOS "icono-cat" al icono de la izquierda */}
                  <i className={`bi ${cat.icon} me-3 fs-4 icono-cat`}></i>
                  
                  <span className="fs-6 fw-semibold flex-grow-1">{cat.name}</span>
                  
                  {/* 3. AQUÍ AÑADIMOS "flecha-cat" al icono de la derecha */}
                  <i className="bi bi-chevron-right text-secondary opacity-50 fs-5 flecha-cat"></i>
                </button>
              ))}
            </div>
              
            <li><hr className="divider-thick" /></li>

            {/* IDIOMA */}
            <li className="menu-section">IDIOMA</li>

            <li className="nav-item">
              <p>Español</p>
            </li>
            <li className="nav-item">
              <p>Inglés</p>
            </li>
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