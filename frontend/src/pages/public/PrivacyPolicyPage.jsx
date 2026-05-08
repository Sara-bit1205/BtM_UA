import React from 'react';

function PoliticaPrivacidad() {
  return (
    <main className="container py-4">
      <h1 className="mb-2 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color3)', fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
        Política de Privacidad
      </h1>
      <h3 className="mb-4 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color3)', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
        Última actualización: octubre 23-2024
      </h3>

      <p className="mb-5" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
        En Behind The Mask (en adelante, "el Sitio Web"), nos comprometemos a proteger la privacidad y la seguridad de los datos personales de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tu información conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <div className="accordion" id="accordionPrivacy">
        
        {/* --- ACORDEÓN 1 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              <i className="bi bi-person-bounding-box me-3 fs-3"></i> Responsable del Tratamiento
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              <p className="mb-1"><strong style={{fontFamily: 'var(--texto-encabezados)', letterSpacing: '1px'}}>Identidad del Responsable:</strong> José Pilar Sánchez</p>
              <p className="mb-1"><strong style={{fontFamily: 'var(--texto-encabezados)', letterSpacing: '1px'}}>Domicilio Social:</strong> Calle de los rumores Puerta no me acuerdo</p>
              <p className="mb-0"><strong style={{fontFamily: 'var(--texto-encabezados)', letterSpacing: '1px'}}>Correo Electrónico de Contacto:</strong> Behind_theMask@hotmail.com</p>
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 2 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <i className="bi bi-share-fill me-3 fs-3"></i> Datos compartidos
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              Aquí puedes poner la información sobre los datos que compartes con terceros.
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 3 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              <i className="bi bi-database-fill me-3 fs-3"></i> Datos que recopilamos
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              Aquí explicas qué datos guardas (emails, contraseñas, preferencias, etc).
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 4 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
              <i className="bi bi-shield-lock-fill me-3 fs-3"></i> Medidas de seguridad
            </button>
          </h2>
          <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              Aquí explicas qué datos guardas (emails, contraseñas, preferencias, etc).
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 5 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
              <i className="bi bi-database-fill me-3 fs-3"></i> Datos que recopilamos
            </button>
          </h2>
          <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              Aquí explicas qué datos guardas (emails, contraseñas, preferencias, etc).
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default PoliticaPrivacidad;
