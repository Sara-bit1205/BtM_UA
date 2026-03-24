import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function FormularioPersonaje() {
    const navigate = useNavigate();
    const location = useLocation();
    // Estado del formulario con todos los campos vacíos por defecto
    // Si le damos al personaje para editarlo, recuperamos los datos del personaje. Si no, es null.
    const personajeAEditar = location.state?.personaje || null;

    // Estado del formulario con todos los campos vacíos por defecto
    const [formData, setFormData] = useState({
        nombre: '',
        historia: '',
        hito: '',
        procedencia: '',
        origen: '',
        universo: '',
        personalidad: '',
        mbti: '',
        interpretaciones: '',
        filmografia: '',
        psicologia: ''
    });

    const [imagenes, setImagenes] = useState([]); // Para almacenar las imágenes seleccionadas
    const fileInputRef = useRef(null); // Referencia al input de archivos para poder abrir el explorador al hacer clic en el botón

    // Si estamos editando un personaje, cargamos sus datos en el formulario al montar el componente
    useEffect(() => {
    if (personajeAEditar) {
      setFormData({
        nombre: personajeAEditar.nombre || '',
        historia: personajeAEditar.descripcion || '', // Mapeando descripción a historia
        hito: '', // Añadimos aquí los demás mapeos cuando los tengas en tu BD
        procedencia: '',
        origen: '',
        universo: '',
        personalidad: '',
        mbti: '',
        interpretaciones: '',
        filmografia: '',
        psicologia: ''
      });
    }
  }, [personajeAEditar]);

  // Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función al darle al botón verde final
  const handleSubmit = (e) => {
    e.preventDefault();
    if (personajeAEditar) {
      console.log('Guardando cambios del personaje:', formData);
      // Aquí irá tu lógica de Supabase para hacer UPDATE
    } else {
      console.log('Creando nuevo personaje:', formData);
      // Aquí irá tu lógica de Supabase para hacer INSERT
    }
    navigate(-1); // Volver atrás después de guardar
  };

    // Función para manejar la selección de imágenes
    const handleImageChange = (e) => {
        // Convertimos los archivos seleccionados en un array
        const archivos = Array.from(e.target.files);
        if (archivos.length > 0) {
        // Creamos URLs locales (temporales) para poder ver las fotos en pantalla
        const nuevasImagenes = archivos.map(archivo => URL.createObjectURL(archivo));
        // Añadimos las nuevas imágenes a las que ya tuviéramos
        setImagenes(prevImagenes => [...prevImagenes, ...nuevasImagenes]);
        }
    };

    // Función para quitar una imagen si le damos a la 'X'
    const eliminarImagen = (indexAEliminar) => {
        setImagenes(prevImagenes => prevImagenes.filter((_, index) => index !== indexAEliminar));
    };

    return (
    <div className="container-fluid pb-5 pt-4" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          
          {/* Título dinámico: Cambia según si editamos o creamos */}
          <h1 className="text-center mb-4 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)' }}>
            {personajeAEditar ? 'EDITAR PERSONAJE' : 'CREAR PERSONAJE'}
          </h1>

          {/* Tarjeta del formulario */}
          <div className="card border-0 p-4 shadow" style={{ backgroundColor: 'var(--color-grisOscuro, #1a1a1a)', borderRadius: '30px' }}>
            <form onSubmit={handleSubmit}>
              
              {/* Estilo reutilizable para los Labels e Inputs */}
              <style>
                {`
                  .form-label-custom {
                    font-family: var(--texto-encabezados);
                    color: #5bc0be; /* Color cian de tu captura */
                    text-transform: uppercase;
                    margin-bottom: 0.2rem;
                    font-size: 1.1rem;
                  }
                  .form-control-custom {
                    border-radius: 50px;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    margin-bottom: 1.5rem;
                  }
                  .form-select-custom {
                    border-radius: 50px;
                    border: none;
                  }
                `}
              </style>

              {/* BLOQUE 1: Datos básicos */}
              <label className="form-label-custom">Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="form-control form-control-custom" />

              <label className="form-label-custom">Historia</label>
              <input type="text" name="historia" value={formData.historia} onChange={handleChange} className="form-control form-control-custom" />

              <label className="form-label-custom">Hito de Creación</label>
              <input type="text" name="hito" value={formData.hito} onChange={handleChange} className="form-control form-control-custom" />

              <label className="form-label-custom">Procedencia</label>
              <input type="text" name="procedencia" value={formData.procedencia} onChange={handleChange} className="form-control form-control-custom" />

              <label className="form-label-custom">Origen Biológico</label>
              <input type="text" name="origen" value={formData.origen} onChange={handleChange} className="form-control form-control-custom" />

              {/* BLOQUE 2: Etiquetas (Selects) */}
              <label className="form-label-custom mb-2">Etiquetas</label>
              <div className="d-flex align-items-center mb-2">
                <span className="text-white fw-bold me-2" style={{ width: '150px' }}>Universo:</span>
                <select name="universo" value={formData.universo} onChange={handleChange} className="form-select form-select-custom w-100">
                  <option value="">Selecciona:</option>
                  <option value="Marvel">Marvel</option>
                  <option value="Disney">Disney</option>
                </select>
              </div>
              <div className="d-flex align-items-center mb-2">
                <span className="text-white fw-bold me-2" style={{ width: '150px' }}>Personalidad:</span>
                <select name="personalidad" value={formData.personalidad} onChange={handleChange} className="form-select form-select-custom w-100">
                  <option value="">Selecciona:</option>
                  <option value="Imponente">Imponente</option>
                  <option value="Caótica">Caótica</option>
                </select>
              </div>
              <div className="d-flex align-items-center mb-4">
                <span className="text-white fw-bold me-2" style={{ width: '150px' }}>Tipo (MBTI):</span>
                <select name="mbti" value={formData.mbti} onChange={handleChange} className="form-select form-select-custom w-100">
                  <option value="">Selecciona:</option>
                  <option value="INTJ">INTJ</option>
                  <option value="ENFP">ENFP</option>
                </select>
              </div>

              {/* BLOQUE 3: Más datos */}
              <label className="form-label-custom">Interpretaciones</label>
              <input type="text" name="interpretaciones" value={formData.interpretaciones} onChange={handleChange} className="form-control form-control-custom" />

              <label className="form-label-custom">Filmografía</label>
              <input type="text" name="filmografia" value={formData.filmografia} onChange={handleChange} className="form-control form-control-custom" />

              <label className="form-label-custom">Psicología del Personaje</label>
              <input type="text" name="psicologia" value={formData.psicologia} onChange={handleChange} className="form-control form-control-custom" />

              {/* BLOQUE 4: Subida de Imágenes */}
              {/* BLOQUE 4: Subida de Imágenes */}
              <div className="text-center mt-4">
                
                {/* 1. Este es el input real que lee archivos. Está oculto (display: none) */}
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  style={{ display: 'none' }} 
                />
                
                {/* 2. Tu botón rosa. Al hacer clic, hace clic en el input oculto por ti */}
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current.click()}
                  className="btn rounded-pill px-4 py-2 text-white fw-bold shadow-sm" 
                  style={{ backgroundColor: '#ff1493', border: 'none' }}
                >
                  AÑADIR IMÁGENES <i className="bi bi-folder2-open ms-2 fs-5"></i>
                </button>
              </div>

              {/* Caja oscura de previsualización de imágenes */}
              <div 
                className="mt-4 p-4 d-flex justify-content-center flex-wrap gap-4" 
                style={{ backgroundColor: '#333333', borderRadius: '20px', minHeight: '120px' }}
              >
                {/* Si no hay imágenes, mostramos un texto. Si hay, las dibujamos */}
                {imagenes.length === 0 ? (
                  <span className="text-white-50 mt-2">No hay imágenes seleccionadas</span>
                ) : (
                  imagenes.map((imgUrl, index) => (
                    <div key={index} className="position-relative">
                      
                      {/* La foto real recortada en círculo */}
                      <img 
                        src={imgUrl} 
                        alt={`Preview ${index}`} 
                        style={{ 
                          width: '75px', 
                          height: '75px', 
                          borderRadius: '50%', 
                          objectFit: 'cover', 
                          border: '3px solid #cbf58c' 
                        }} 
                      />
                      
                      {/* Botón X para borrar */}
                      <span 
                        onClick={() => eliminarImagen(index)}
                        className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-info text-dark shadow" 
                        style={{ cursor: 'pointer', padding: '0.4rem 0.6rem', border: '2px solid white' }}
                      >
                        x
                      </span>
                      
                    </div>
                  ))
                )}
              </div>

              {/* BOTÓN FINAL DE GUARDAR */}
              <div className="text-center mt-5">
                <button type="submit" className="btn rounded-pill px-5 py-2 fw-bold" style={{ backgroundColor: '#cbf58c', color: '#111', fontSize: '1.2rem', fontFamily: 'var(--texto-encabezados)' }}>
                  {personajeAEditar ? 'GUARDAR' : 'CREAR'}
                </button>
              </div>
              
              {/* Botón Volver Atrás */}
              <button type="button" onClick={() => navigate(-1)} className="btn border-0 p-0 position-absolute bottom-0 start-0 m-4" style={{ color: '#cbf58c' }}>
                <i className="bi bi-arrow-left-circle-fill" style={{ fontSize: '2.5rem' }}></i>
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioPersonaje;