import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getPublicUrl, STORAGE_BUCKETS } from '../../lib/storage';
import characterService from '../../services/characterService';
import '../../assets/styles/adminPersonajes.css';

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
            
            // Si ya tenemos las tags de personalidad, no hace falta volver a buscar
            if (personaje && personaje.character_personality_tags) {
                setLoading(false);
                return;
            }

            try {
                // Fetch completo para asegurar que tenemos todos los datos relacionales
                const data = await characterService.getById(id);
                setPersonaje(data);
            } catch (error) {
                console.error('Error cargando personaje para eliminar:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPersonaje();
    }, [id]);

    if (loading) {
        return (
            <div className="container text-center mt-5 text-white" style={{ color: 'var(--colorTexto)', fontFamily: 'var(--texto-normal)' }}>
                <h2>Cargando personaje...</h2>
            </div>
        );
    }

    if (!id || !personaje) {
        return (
        <div className="container text-center mt-5 text-white" style={{ color: 'var(--colorTexto)', fontFamily: 'var(--texto-normal)' }}>
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
        <div className="container-fluid pb-5 pt-4" style={{ backgroundColor: 'var(--color-principal)', minHeight: '100vh', color: 'var(--colorTexto)' }}>
        <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
            
            {/* Tarjeta principal */}
            <div className="card border-0 p-4 shadow" style={{ backgroundColor: 'var(--color-grisOscuro)', borderRadius: '30px' }}>
                
                {/* Título */}
                <h1 className="text-center mb-4 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color4)' }}>
                BORRAR PERSONAJE
                </h1>

                {/* Nombre del personaje */}
                <h2 className="mb-3 text-uppercase" style={{ fontFamily: 'var(--texto-encabezados)', color: 'var(--color3)' }}>
                {personaje.name}
                </h2>

                {/* Imagen centrada */}
                <div className="text-center mb-4">
                <img 
                    src={personaje.imagen || (personaje.cover_path ? getPublicUrl(STORAGE_BUCKETS.characterCovers, personaje.cover_path) : null)} 
                    alt={personaje.name}
                    className="bg-white" 
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
                <ul style={{ fontSize: '1.1rem', lineHeight: '1.6', listStylePosition: 'inside', paddingLeft: 0, color: 'var(--colorTexto)' }}>
                    <li><span className="fw-bold" style={{ color: 'var(--color4)' }}>Personalidad:</span> {personaje.character_personality_tags?.length > 0 ? personaje.character_personality_tags.map(t => t.personality_tags?.name).filter(Boolean).join(', ') : 'Ninguna'}</li>
                    <li><span className="fw-bold" style={{ color: 'var(--color4)' }}>Universo:</span> {personaje.universes?.name || 'Desconocido'}</li>
                    <li><span className="fw-bold" style={{ color: 'var(--color4)' }}>Tipo de Personalidad (MBTI):</span> {personaje.mbti_types ? `${personaje.mbti_types.title} (${personaje.mbti_types.code})` : 'Desconocido'}</li>
                </ul>
                </div>

                {/* Cuadro gris de advertencia */}
                <div className="p-4 mb-4" style={{ backgroundColor: 'var(--color-principal)', border: '1px solid var(--color2)', borderRadius: '25px', textAlign: 'center' }}>
                <p className="m-0 fs-6" style={{ color: 'var(--colorTexto)' }}>
                    ¿Confirmas que deseas borrar este personaje? También desaparecerán sus imágenes, categorías y personalidades a las que pertenezca.
                </p>
                </div>

                {/* Botones de acción */}
                <div className="d-flex justify-content-center gap-3 mt-2 flex-wrap">
                {/* Botón ACEPTAR  */}
                <button 
                    onClick={handleBorrar}
                    disabled={deleting}
                    className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 shadow btnEliminarPers deleteActionBtn"
                    style={{ fontSize: '1.3rem !i' }}
                >
                    {deleting ? 'Borrando...' : 'Aceptar'} 
                    {!deleting && <i className="bi bi-trash"></i>}
                </button>

                {/* Botón CANCELAR */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 shadow btnAnadirPelis deleteActionBtn"
                    style={{ color: 'var(--colorTexto)', fontSize: '1.3rem', fontFamily: 'var(--texto-encabezados) !important' }}
                >
                    <i className="bi bi-arrow-left"></i> Cancelar
                </button>
                </div>

            </div>
            </div>
        </div>
        </div>
    );
}

export default EliminarPersonaje