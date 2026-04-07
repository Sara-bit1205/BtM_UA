/*Este Navbar es la barra de navegación principal de la app: muestra 
el logo con acceso al inicio, un buscador que redirige a la página de 
búsqueda con el término en la URL, botones de acciones como filtros y 
estilos, un acceso dinámico al perfil o al login según si el usuario 
está autenticado, y un menú lateral responsive con enlaces a distintas 
secciones de la web. Con el ajuste de auth, deja de depender del user 
antiguo y pasa a usar el estado real de Supabase a través de 
isAuthenticated y role.*/

import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { useAuth } from '../../context/AuthContext'
import StylePanel from './StylePanel'


const CATEGORIES = [
  { id: 'universos', name: 'Universos', icon: 'bi-globe' },
  { id: 'personalidades', name: 'Personalidades', icon: 'bi-people-fill' },
  { id: 'psicologia', name: 'Psicología', icon: 'bi-puzzle-fill' },
]

function Navbar() {
  const { role, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(null)
  const location = useLocation(); // Importar de react-router-dom
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/busqueda?query=${encodeURIComponent(searchTerm)}`)
      setSearchTerm('')
    }
  }

  const handleFilterClick = () => {
    if (location.pathname !== '/busqueda') {
      navigate('/busqueda?openFilters=true');
    } else {
      // Si ya estamos en búsqueda, emitimos un evento personalizado 
      // o usamos un estado global. Lo más simple:
      window.dispatchEvent(new CustomEvent('toggle-search-filters'));
    }
  };

  const profilePath = !isAuthenticated
    ? '/login'
    : role === 'admin'
      ? '/admin'
      : '/perfil'

  return (
    <>
      <nav className="navBar">
        <div className="container-fluid d-flex align-items-center justify-content-between gap-2">
          <div className="navBarLogo d-flex align-items-center justify-content-center">
            <Link to="/">
              <img src={logo} alt="Behind The Mask" className="navBarLogo-img" />
            </Link>
          </div>

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

          <div className="navBarActions d-flex align-items-center gap-3">
            <button type="button" className="btnFilter" aria-label="Filtrar" onClick={handleFilterClick}>
              <i className="bi bi-funnel-fill"></i>
            </button>

            <button
              type="button"
              className="btnStyle"
              aria-label="Cambiar estilo"
              aria-expanded={isStylePanelOpen}
              aria-controls="stylePanel"
              onClick={() => setIsStylePanelOpen((prev) => !prev)}
            >
              <i className="bi bi-brush"></i>
            </button>

            <Link to={profilePath} className="profile-link">
              <button type="button" className="btnUser" aria-label="Perfil">
                <i className="bi bi-person-circle"></i>
              </button>
            </Link>

            <button
              type="button"
              className="btnMenu navbar-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Menú"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="offcanvasNavbarLabel">
            MENÚ
          </h3>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Cerrar"
          ></button>
        </div>

        <li><hr className="divider-thick" /></li>

        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="menu-section">SOBRE BtM</li>

            <li className="nav-item">
              <Link className="nav-link" to="/que-es-btm">
                Qué es BtM
              </Link>
            </li>

            <li><hr className="divider-thick" /></li>

            <li className="menu-section">PERSONALIDAD</li>

            <li className="nav-item">
              <Link className="nav-link" to="/test-personalidad">
                Test MBTI
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/tipos-personalidad">
                Tipos de personalidad MBTI
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/como-se-calcula">
                Cómo se calculan los resultados
              </Link>
            </li>

            <li><hr className="divider-thick" /></li>

            <li className="menu-section">EXPLORAR</li>

            <div className="d-flex flex-column">
              <style>
                {`
                  .btn-categoria {
                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                    border-radius: 12px !important;
                    margin-bottom: 8px;
                  }
                  .btn-categoria:hover {
                    transform: translateX(8px);
                    background-color: rgba(150, 150, 150, 0.15) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                  }
                  .btn-categoria:active {
                    transform: scale(0.97) translateX(8px);
                  }
                  .btn-categoria .icono-cat {
                    transition: transform 0.3s ease;
                  }
                  .btn-categoria:hover .icono-cat {
                    transform: scale(1.15) rotate(5deg);
                  }
                  .btn-categoria .flecha-cat {
                    transition: all 0.3s ease;
                  }
                  .btn-categoria:hover .flecha-cat {
                    transform: translateX(5px);
                    opacity: 1 !important;
                  }
                `}
              </style>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id)
                    navigate(`/clasificador/${cat.id}`)
                  }}
                  data-bs-dismiss="offcanvas"
                  className={`btn btn-categoria d-flex align-items-center w-100 text-start border-0 px-3 py-3 ${
                    activeCategory === cat.id ? 'bg-secondary bg-opacity-25' : 'bg-transparent'
                  }`}
                  style={{ color: 'inherit' }}
                >
                  <i className={`bi ${cat.icon} me-3 fs-4 icono-cat`}></i>
                  <span className="fs-6 fw-semibold flex-grow-1">{cat.name}</span>
                  <i className="bi bi-chevron-right text-secondary opacity-50 fs-5 flecha-cat"></i>
                </button>
              ))}
            </div>

            <li><hr className="divider-thick" /></li>

            <li className="menu-section">MULTIMEDIA</li>

            <li className="nav-item">
              <Link className="nav-link" to="/descargas">
                Descargas
              </Link>
            </li>

            <li><hr className="divider-thick" /></li>

            <li className="menu-section">IDIOMA</li>

            <li className="nav-item">
              <div className="d-flex align-items-center gap-4 px-2 py-2"></div>
            </li>

            <li><hr className="divider-thick" /></li>
          </ul>
        </div>
      </div>

      <div id="style-panel">
        <StylePanel
          isOpen={isStylePanelOpen}
          onClose={() => setIsStylePanelOpen(false)}
        />
      </div>
    </>
  )
}

export default Navbar