import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getPublicUrl, STORAGE_BUCKETS } from '../../lib/storage'
import characterService from '../../services/characterService'

function EliminarPersonaje() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(Boolean(id && !location.state?.personaje));
    const [personaje, setPersonaje] = useState(location.state?.personaje || null);

    useEffect(() => {
        const loadPersonaje = async () => {
            if (!id) return;
            if (personaje && String(personaje.id) === id) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const data = await characterService.getById(id);
                setPersonaje({
                    id: data.id,
                    name: data.name,
                    imagen: data.cover_path ? getPublicUrl(STORAGE_BUCKETS.characterCovers, data.cover_path) : null,
                });
            } catch (error) {
                console.error('Error cargando personaje para eliminar:', error);
                setPersonaje(null);
            } finally {
                setLoading(false);
            }
        };

        loadPersonaje();
    }, [id, personaje]);

    if (loading) {
        return (
            <div className="container text-center mt-5 text-white">
                <h2>Cargando personaje...</h2>
            </div>
        );
    }

    if (!id || !personaje) {
        return (
        <div className="container text-center mt-5 text-white">
            <h2>No hay personaje seleccionado</h2>
            <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>Volver</button>
        </div>
        );
    }

    const handleBorrar = async () => {
        const characterId = id || personaje?.id;
        if (!characterId) return;

        setDeleting(true);

        try {
            await characterService.removeFull(characterId);
            navigate('/admin/lista-personajes', { replace: true });
        } catch (error) {
            console.error('Error borrando personaje:', error);
            alert('No se pudo borrar el personaje. Revisa la consola para más detalles.');
        } finally {
            setDeleting(false);
        }
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
                {personaje.name}
                </h2>

                {/* Imagen centrada */}
                <div className="text-center mb-4">
                <img 
                    src={personaje.imagen} 
                    alt={personaje.name}
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
                    disabled={deleting}
                    className="btn rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm"
                    style={{ backgroundColor: 'var(--color1, #a8e860)', color: '#000', border: '2px solid #85c249', fontFamily: 'var(--texto-encabezados)', fontSize: '1.2rem' }}
                >
                    {deleting ? 'Borrando...' : 'Aceptar'}
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