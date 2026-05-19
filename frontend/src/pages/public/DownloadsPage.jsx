import React from 'react';
import '../../assets/styles/home.css'; 

function DownloadsInfoPage() {
  return (
    <main className="container mt-5 pt-5" style={{ color: 'var(--colorTexto)' }}>
      <h1 className="mb-4">Guía de Descargas</h1>
      <p className="lead">En Behind The Mask, puedes obtener material exclusivo de tus personajes favoritos.</p>
      
      <hr className="divider-thick mb-4" />

      <section className="mb-5">
        <h3><i className="bi bi-camera-reels me-2"></i>Filmografía</h3>
        <p>En la sección de filmografía de cada personaje, verás un botón de descarga <i className="bi bi-download"></i> sobre el póster de la película. Al pulsarlo, obtendrás la carátula oficial en alta resolución.</p>
      </section>

      <section className="mb-5">
        <h3><i className="bi bi-images me-2"></i>Imágenes Relacionadas</h3>
        <p>Dentro del acordeón "Imágenes relacionadas", encontrarás artes conceptuales y capturas. Cada imagen tiene su propio botón de descarga directa a tu dispositivo.</p>
      </section>

      <section className="mb-5">
        <h3><i className="bi bi-music-note-beamed me-2"></i>Audios y Bandas Sonoras</h3>
        <p>Puedes escuchar los temas principales directamente en la web. Además podrás descargar los audios y consultar sus transcripciones.</p>
      </section>

      <section className="mb-5">
        <h3><i className="bi bi-file-earmark-richtext me-2"></i>Galería de Comunidad y Archivos</h3>
        <p>Podrás añadir cualquier documento, imagen o video a la galeria de comunidad de un personaje, así cómo podrás descargarlos.</p>
      </section>

      <div className="alert alert-info bg-dark text-light border-0">
        <i className="bi bi-info-circle me-2"></i>
        Nota: Para subir tus propias imágenes a la <strong>Galería de la Comunidad</strong>, debes estar registrado e iniciar sesión.
      </div>
    </main>
  );
}

export default DownloadsInfoPage;