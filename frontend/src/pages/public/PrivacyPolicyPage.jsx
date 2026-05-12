import React from 'react';

function PoliticaPrivacidad() {
  return (
    <main className="container py-4">
      <h1 className="mb-2 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color3)', fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
        Política de Privacidad
      </h1>
      <h3 className="mb-4 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color3)', fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
        Última actualización: mayo 2026
      </h3>

      <p className="mb-5" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
        En <strong>Behind The Mask</strong> (en adelante, "la Plataforma"), nos comprometemos a proteger la privacidad y la seguridad de los datos personales de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tu información conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
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
              <p className="mb-1"><strong style={{ fontFamily: 'var(--texto-encabezados)', letterSpacing: '1px' }}>Identidad del Responsable:</strong> Equipo Behind The Mask — Celia Fortea, Sara Díaz, Nicolás Florez y Álvaro Millán</p>
              <p className="mb-1"><strong style={{ fontFamily: 'var(--texto-encabezados)', letterSpacing: '1px' }}>Centro:</strong> Universidad de Alicante — Grado en Ingeniería Multimedia</p>
              <p className="mb-0"><strong style={{ fontFamily: 'var(--texto-encabezados)', letterSpacing: '1px' }}>Correo Electrónico de Contacto:</strong> behindthemask.ua@gmail.com</p>
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 2 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              <i className="bi bi-database-fill me-3 fs-3"></i> Datos que recopilamos
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Al registrarte y utilizar Behind The Mask, podemos recopilar los siguientes datos personales:
              </p>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Datos de registro:</strong> nombre de usuario, dirección de correo electrónico, contraseña (almacenada de forma cifrada) y fecha de nacimiento.</li>
                <li><strong>Datos de perfil:</strong> foto de avatar, descripción personal y tipo de personalidad MBTI obtenido mediante el test de la plataforma.</li>
                <li><strong>Contenido generado:</strong> personajes marcados como favoritos e imágenes subidas a la galería personal.</li>
                <li><strong>Datos de navegación:</strong> información técnica básica como el tipo de navegador y dispositivo, necesaria para garantizar el correcto funcionamiento de la plataforma.</li>
              </ul>
              <p className="mb-0" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                No se recopilan datos especialmente sensibles más allá de los indicados. El correo electrónico y la contraseña son gestionados de forma segura a través de <strong>Supabase Auth</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 3 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              <i className="bi bi-bullseye me-3 fs-3"></i> Finalidad del tratamiento
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Los datos recogidos se utilizan exclusivamente para las siguientes finalidades:
              </p>
              <ul style={{ lineHeight: '2' }}>
                <li>Gestionar el registro, inicio de sesión y autenticación del usuario en la plataforma.</li>
                <li>Permitir la personalización del perfil de usuario, incluyendo avatar y descripción.</li>
                <li>Almacenar y mostrar los personajes marcados como favoritos por el usuario.</li>
                <li>Guardar el resultado del test de personalidad MBTI asociado a la cuenta.</li>
                <li>Gestionar la galería de imágenes subidas por el usuario.</li>
                <li>Diferenciar entre usuarios con rol estándar y usuarios administradores para el control de acceso a las funciones del panel de gestión.</li>
              </ul>
              <p className="mb-0" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                En ningún caso los datos serán utilizados con fines comerciales, publicitarios o cedidos a terceros con fines ajenos a los descritos.
              </p>
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
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Behind The Mask implementa las siguientes medidas técnicas para proteger tus datos:
              </p>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Autenticación segura:</strong> la gestión de credenciales se realiza a través de Supabase Auth, que emplea cifrado estándar del sector para el almacenamiento de contraseñas.</li>
                <li><strong>Control de acceso por roles:</strong> mediante políticas de seguridad a nivel de fila (Row Level Security — RLS) en la base de datos, cada usuario solo puede acceder y modificar sus propios datos.</li>
                <li><strong>Almacenamiento seguro de archivos:</strong> las imágenes y avatares se almacenan en Supabase Storage con control de permisos por usuario.</li>
                <li><strong>Comunicaciones cifradas:</strong> toda la comunicación entre el navegador y los servidores se realiza bajo protocolo HTTPS.</li>
                <li><strong>Acceso restringido:</strong> únicamente los usuarios con rol de administrador pueden acceder al panel de gestión de la plataforma.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* --- ACORDEÓN 5 --- */}
        <div className="accordion-item btm-accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed btm-accordion-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
              <i className="bi bi-patch-check-fill me-3 fs-3"></i> Tus derechos
            </button>
          </h2>
          <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionPrivacy">
            <div className="accordion-body btm-accordion-body">
              <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Conforme al RGPD, tienes derecho a:
              </p>
              <ul style={{ lineHeight: '2' }}>
                <li><strong>Acceso:</strong> conocer qué datos tuyos están almacenados en la plataforma.</li>
                <li><strong>Rectificación:</strong> corregir datos incorrectos o desactualizados desde la sección de edición de perfil.</li>
                <li><strong>Supresión:</strong> solicitar la eliminación de tu cuenta y todos los datos asociados.</li>
                <li><strong>Oposición:</strong> oponerte al tratamiento de tus datos en determinadas circunstancias.</li>
                <li><strong>Portabilidad:</strong> solicitar una copia de tus datos en formato estructurado.</li>
              </ul>
              <p className="mb-0" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                Para ejercer cualquiera de estos derechos, puedes contactar con nosotros a través del correo <strong>behindthemask.ua@gmail.com</strong>. Asimismo, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

export default PoliticaPrivacidad;
