// Página principal — accesible sin autenticación
// Punto de entrada: muestra bienvenida, accesos a Menú Lateral y búsqueda

import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main className="container text-center mt-5">
      <h1 className="display-4">Behind The Mask</h1>
      <p className="lead">Bienvenido a nuestra plataforma de análisis de personalidades.</p>
      
    </main>
  );
}

export default HomePage;