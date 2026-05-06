/*Este Navbar es la barra de navegación principal de la app: muestra 
el logo con acceso al inicio, un buscador que redirige a la página de 
búsqueda con el término en la URL, botones de acciones como filtros y 
estilos, un acceso dinámico al perfil o al login según si el usuario 
está autenticado, y un menú lateral responsive con enlaces a distintas 
secciones de la web. Con el ajuste de auth, deja de depender del user 
antiguo y pasa a usar el estado real de Supabase a través de 
isAuthenticated y role.*/

import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";
import StylePanel from "./StylePanel";

const CATEGORIES = [
  { id: "universos", name: "Universos", icon: "bi-globe" },
  { id: "personalidades", name: "Personalidades MBTI", icon: "bi-people-fill" },
];

function Navbar() {
  const { role, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const location = useLocation(); // Importar de react-router-dom

  //-------------------------------PRUEBA DE LA BARRA DE BUSQUEDA EN MÓVIL-------------------------------
  const [mostrarBuscadorMovil, setMostrarBuscadorMovil] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/busqueda?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    } else {
      navigate("/busqueda");
    }
    setSearchTerm("");
    setMostrarBuscadorMovil(false);
  };

  const handleFilterClick = () => {
    if (location.pathname !== "/busqueda") {
      navigate("/busqueda?openFilters=true");
    } else {
      // Si ya estamos en búsqueda, emitimos un evento personalizado
      // o usamos un estado global. Lo más simple:
      window.dispatchEvent(new CustomEvent("toggle-search-filters"));
    }
  };

  const profilePath = !isAuthenticated
    ? "/login"
    : role === "admin"
      ? "/admin"
      : "/perfil";

  return (
    <>
      <nav className="navBar">
        {/* CONTENEDOR PRINCIPAL */}
        <div className="container-fluid d-flex align-items-center justify-content-between gap-2">
          <div className="navBarLogo d-flex align-items-center justify-content-center">
            <Link to="/">
              <img
                src={logo}
                alt="Behind The Mask"
                className="navBarLogo-img"
              />
            </Link>
          </div>

          {/* BUSCADOR DE PC (Se oculta en móvil) */}
          <form
            className="navBarSearch flex-grow-1 d-none d-md-flex"
            onSubmit={handleSubmit}
          >
            <div className="input-group buscarPersonaje">
              <button type="submit" className="input-group-text navBar__search-icon border-0 bg-transparent">
                <i className="bi bi-search"></i>
              </button>
              <input
                type="text"
                className="form-control navBar__input"
                placeholder="Buscar personaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          {/* BOTONES DE ACCIÓN */}
          <div className="navBarActions d-flex align-items-center gap-2 gap-md-3">
            {/* 1. BOTÓN BUSCAR MÓVIL (Enciende/Apaga el interruptor) */}
            <button
              type="button"
              className="btn-buscar-mobile d-md-none"
              aria-label="Abrir buscador"
              onClick={() => setMostrarBuscadorMovil(!mostrarBuscadorMovil)}
            >
              {/* Cambiamos el icono a una 'X' si está abierto */}
              <i
                className={mostrarBuscadorMovil ? "bi bi-x-lg" : "bi bi-search"}
              ></i>
            </button>

            {/* 2. Filtro */}
            <button
              type="button"
              className="btnFilter"
              onClick={handleFilterClick}
            >
              <i className="bi bi-funnel-fill"></i>
            </button>

            {/* 3. Estilos */}
            <button
              type="button"
              className="btnStyle"
              onClick={() => setIsStylePanelOpen((prev) => !prev)}
            >
              <i className="bi bi-brush"></i>
            </button>

            {/* 4. Perfil */}
            <Link to={profilePath} className="profile-link">
              <button type="button" className="btnUser">
                <i className="bi bi-person-circle"></i>
              </button>
            </Link>

            {/* 5. Menú */}
            <button
              type="button"
              className="btnMenu navbar-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>

        {/* --- LA MAGIA: EL BUSCADOR DESPLEGABLE PARA MÓVIL --- */}
        {mostrarBuscadorMovil && (
          <div className="buscador-movil-container d-md-none">
            <form onSubmit={handleSubmit} className="buscador-movil-form">
              {/* EL MOLDE: Une el input y el botón */}
              <div className="input-group buscador-movil-wrapper">
                <input
                  type="text"
                  className="form-control buscador-movil-input"
                  placeholder="¿A quién buscas...?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />

                <button
                    type="submit"
                    className="btn buscador-movil-btn"
                  >
                  <i className="bi bi-search fw-bold"></i>
                </button>

              </div>
            </form>
          </div>
        )}
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

        
        <hr className="divider-thick" />

        <div className="offcanvas-body">
          <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
            <li className="menu-section">SOBRE BtM</li>

            <li className="nav-item">
              <Link className="nav-link" to="/que-es-btm">
                Qué es BtM
              </Link>
            </li>

            <li>
              <hr className="divider-thick" />
            </li>

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

            <li>
              <hr className="divider-thick" />
            </li>

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
                    setActiveCategory(cat.id);
                    navigate(`/clasificador/${cat.id}`);
                  }}
                  data-bs-dismiss="offcanvas"
                  className={`btn btn-categoria d-flex align-items-center w-100 text-start border-0 px-3 py-3 ${
                    activeCategory === cat.id
                      ? "bg-secondary bg-opacity-25"
                      : "bg-transparent nav-item"
                  }`}
                  style={{ color: "inherit" }}
                >
                  <i
                    className={`bi ${cat.icon} me-3 fs-4 icono-cat nav-item`}
                  ></i>
                  <span className="nav-item">{cat.name}</span>
                  <i className="bi bi-chevron-right nav-item justify-content-end center"></i>
                </button>
              ))}
            </div>

            <li>
              <hr className="divider-thick" />
            </li>

            <li className="menu-section">MULTIMEDIA</li>

            <li className="nav-item">
              <Link className="nav-link" to="/descargas">
                Descargas
              </Link>
            </li>

            <li>
              <hr className="divider-thick" />
            </li>
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
  );
}

export default Navbar;
