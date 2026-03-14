import logo from '../../assets/styles/logo.png';
// Barra de navegación superior
function Navbar() {
  return (
    <nav className="navBar">
      <div className="container-fluid d-flex align-items-center justify-content-between gap-2">

        {/* Logo */}
        <div className="navBarLogo d-flex align-items-center justify-content-center">
          <img src={logo} alt="Behind The Mask" className="navBarLogo-img" />
        </div>

        {/* Buscador */}
        <div className="navBarSearch flex-grow-1">
          <div className="input-group">
            <span className="input-group-text navBar__search-icon">
              <i className="bi bi-search"></i>
            </span>
            <input type="text" className="form-control navBar__input" placeholder="Buscar personaje..." aria-label="Buscar personaje" />
          </div>
        </div>

        {/* Iconos derecha */}
        <div className="navBarActions d-flex align-items-center gap-3">
          <button type="button" className="btnFilter" aria-label="Filtrar">
            <i className="bi bi-funnel-fill"></i>
          </button>

          <button type="button" className="btnStyle" aria-label="Cambiar estilo">
            <i className="bi bi-brush"></i>
          </button>

          <button type="button" className="btnUser" aria-label="Perfil">
            <i className="bi bi-person-circle"></i>
          </button>

          <button type="button" className="btnMenu" aria-label="Menú">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
