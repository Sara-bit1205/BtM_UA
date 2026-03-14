// Página principal — accesible sin autenticación
// Punto de entrada: muestra bienvenida, accesos a Menú Lateral y búsqueda

import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="container text-center mt-5">
      <h1 className="display-4">Behind The Mask</h1>
      <p className="lead">Bienvenido a nuestra plataforma de análisis de personalidades.</p>
      
      <div className="mt-4">
        {/* Usamos Link para navegar sin recargar la página */}
        <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">
          Iniciar Sesión
        </Link>
        
        <Link to="/register" className="btn btn-outline-secondary btn-lg px-4 ms-2">
          Registrarse
        </Link>
      </div>
    </main>
  );
}

export default HomePage;