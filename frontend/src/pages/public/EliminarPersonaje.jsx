import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function EliminarPersonaje() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Recuperamos el personaje que nos han pasado desde la lista
    const personaje = location.state?.personaje || null;

    // Si alguien entra a esta URL directamente sin un personaje, lo devolvemos a la lista
    if (!personaje) {
        return (
        <div className="container text-center mt-5 text-white">
            <h2>No hay personaje seleccionado</h2>
            <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Volver</button>
        </div>
        );
    }

    // Función para borrar realmente (Aquí irá tu lógica de Supabase)
    const handleBorrar = () => {
        console.log(`Borrando a ${personaje.nombre} de la base de datos...`);
        // TODO: Supabase DELETE request
        
        // Después de borrar, volvemos a la lista
        navigate('/admin/lista-personajes', { replace: true });
    };

    return (
        <div className="container-fluid pb-5 pt-4" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
            
            {/* Tarjeta principal oscura */}
            <div className="card border-0 p-4 shadow" style={{ backgroundColor: 'var(--color-grisOscuro, #1a1a1a)', borderRadius: '30px' }}>
                
                {/* Título */}
                <h1 className="text-center mb-4 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color1)' }}>
                BORRAR PERSONAJE
                </h1>

                {/* Nombre del personaje */}
                <h2 className="mb-3 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: '#5bc0be' }}>
                {personaje.nombre}
                </h2>

                {/* Imagen centrada */}
                <div className="text-center mb-4">
                <img 
                    src={personaje.imagen} 
                    alt={personaje.nombre}
                    className="bg-white" // Fondo blanco por si es PNG transparente
                    style={{ 
                    width: '180px', 
                    height: '180px', 
                    objectFit: 'cover', 
                    borderRadius: '20px' 
                    }}
                />
                </div>

                {/* Sección de Etiquetas */}
                <div className="mb-4">
                <h4 style={{ color: 'var(--color1)', fontWeight: 'bold' }}>Etiquetas:</h4>
                <ul style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    <li><span className="fw-bold">Personalidad:</span> Oscura, Amenazante</li>
                    <li><span className="fw-bold">Universo:</span> Marvel</li>
                    <li><span className="fw-bold">Tipo de Personalidad (MBTI):</span> La Arquitecta (INTJ)</li>
                </ul>
                </div>

                {/* Cuadro gris de advertencia */}
                <div className="p-4 mb-4" style={{ backgroundColor: '#333333', borderRadius: '25px', textAlign: 'center' }}>
                <p className="m-0 fs-5" style={{ color: '#e0e0e0' }}>
                    ¿Confirmas que deseas borrar este personaje? También desaparecerán sus imágenes, categorías y personalidades a las que pertenezca.
                </p>
                </div>

                {/* Botones de acción */}
                <div className="d-flex justify-content-center gap-4 mt-2">
                {/* Botón ACEPTAR (Verde) */}
                <button 
                    onClick={handleBorrar}
                    className="btn rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm"
                    style={{ backgroundColor: 'var(--color1, #a8e860)', color: '#000', border: '2px solid #85c249', fontFamily: 'var(--texto-encabezados)', fontSize: '1.2rem' }}
                >
                    Aceptar
                </button>

                {/* Botón CANCELAR (Rosa Fucsia) */}
                <button 
                    onClick={() => navigate(-1)} // Volver atrás sin hacer nada
                    className="btn rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm"
                    style={{ backgroundColor: '#ff1493', color: '#000', border: '2px solid #c91074', fontFamily: 'var(--texto-encabezados)', fontSize: '1.2rem' }}
                >
                    Cancelar
                </button>
                </div>

            </div>
            </div>
        </div>
        </div>
    );
}

export default EliminarPersonaje