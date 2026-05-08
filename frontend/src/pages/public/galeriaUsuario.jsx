import React, { use, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../assets/styles/galeria.css";
import userService from "../../services/userService";

const GaleriaUsuario = () => {
  const [fotos, setFotos] = useState([]);
  const [loadingFotos, setLoading] = useState(true);

  const [fotoExtendida, setFotoExtendida] = useState(null);

  const [modoseleccion, setModoseleccion] = useState(false);

  const [fotosEliminar, setFotosEliminar] = useState([]);

  function getFileType(path) {
    if (!path) return 'other'
    const ext = path.split('.').pop().split('?')[0].toLowerCase()
    if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) return 'image'
    if (['mp4','webm','ogg','mov','avi','mkv'].includes(ext)) return 'video'
    if (['pdf'].includes(ext)) return 'pdf'
    if (['mp3','wav','aac','flac','m4a'].includes(ext)) return 'audio'
    return 'other'
  }

  function getFileIcon(path) {
    if (!path) return 'bi-file-earmark'
    const ext = path.split('.').pop().split('?')[0].toLowerCase()
    if (['doc','docx'].includes(ext)) return 'bi-file-earmark-word'
    if (['xls','xlsx'].includes(ext)) return 'bi-file-earmark-excel'
    if (['ppt','pptx'].includes(ext)) return 'bi-file-earmark-ppt'
    if (['zip','rar','7z','tar','gz'].includes(ext)) return 'bi-file-earmark-zip'
    return 'bi-file-earmark'
  }

  async function downloadStorageFile(path, filename) {
    try {
      const { data, error } = await supabase.storage.from('gallery').download(path)
      if (error) throw error
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = filename || 'archivo'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error descargando archivo:', error.message)
      alert('Error al descargar el archivo')
    }
  }
  const toggleSeleccionFoto = (fotoId) => {
    setFotosEliminar((prev) =>
      prev.includes(fotoId)
        ? prev.filter((id) => id !== fotoId)
        : [...prev, fotoId],
    );
  };
  useEffect(() => {
    const cargarFotos = async () => {
      setLoading(true)

      try {
        const fotosData = await userService.getMyCommunityPhotos()
        setFotos(fotosData)
      } catch (error) {
        console.error("Error al cargar las fotos del usuario:", error)
        setFotos([])
      } finally {
        setLoading(false)
      }
    }

    cargarFotos()
  }, []);

  // Función para eliminar una foto
 const eliminarFotos = async () => {
    try {
      await userService.deleteMyCommunityPhotos(fotosEliminar, fotos)

      setFotos((prev) => prev.filter((foto) => !fotosEliminar.includes(foto.id)))
      setFotosEliminar([])
      setModoseleccion(false)
    } catch (error) {
      console.error("Error al eliminar las fotos por completo:", error)
      alert("Hubo un error al borrar las fotos. Por favor, inténtalo de nuevo.")
    }
  };

  return (
    <div className="galeria-container pb-5">
      {" "}
      {/* --- CABECERA --- */}
      <header className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h2
          style={{
            fontFamily: "var(--texto-encabezados)",
            color: "var(--color1)",
          }}
        >
          Mis archivos
        </h2>
        <button
          className="btn fw-bold rounded-pill px-4"
          style={{
            backgroundColor: modoseleccion ? 'var(--color1)' : 'var(--color4)',
            color: 'var(--color-principal)',
          }}
          onClick={() => {
            setModoseleccion(!modoseleccion)
            setFotosEliminar([])
          }}
        >
          {modoseleccion ? 'Cancelar' : 'Seleccionar'}
        </button>
      </header>
      {/* --- CUADRÍCULA --- */}
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 px-2">
        {loadingFotos ? (
          <p className="text-muted">Cargando fotos...</p>
        ) : fotos.length > 0 ? (
          fotos.map((foto) => {
            // Variable para saber si ESTA foto en concreto está seleccionada
            const estaSeleccionada = fotosEliminar.includes(foto.id);

            return (
              <div key={foto.id} className="col">
                {/* LA TARJETA CLICKABLE */}
                <div
                  className="card h-100 border-0 shadow-sm galeria-card"
                  style={{
                    backgroundColor: "transparent",
                    position: "relative",
                    borderRadius: "15px",
                    overflow: "hidden",
                    cursor: modoseleccion
                      ? "pointer"
                      : getFileType(foto.imagePath) === 'image'
                        ? 'zoom-in'
                        : 'default',
                    transform: estaSeleccionada ? "scale(0.95)" : "scale(1)",
                    transition: "all 0.2s ease",
                    border: estaSeleccionada
                      ? "3px solid var(--color1)"
                      : "3px solid transparent",
                  }}
                  onClick={() => {
                    if (modoseleccion) {
                      toggleSeleccionFoto(foto.id);
                    } else if (getFileType(foto.imagePath) === 'image') {
                      setFotoExtendida(foto);
                    }
                  }}
                >
                  {modoseleccion && estaSeleccionada && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 1,
                      }}
                    ></div>
                  )}

                  {/* EL "CHECKBOX" FALSO CON ICONOS REDONDOS */}
                  {modoseleccion && (
                    <div
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        zIndex: 2,
                      }}
                    >
                      {estaSeleccionada ? (
                        <i
                          className="bi bi-check-circle-fill"
                          style={{
                            color: "var(--color1)",
                            fontSize: "1.5rem",
                            borderRadius: "50%",
                          }}
                        ></i>
                      ) : (
                        <i
                          className="bi bi-circle"
                          style={{
                            color: "white",
                            fontSize: "1.5rem",
                            textShadow: "0px 0px 4px rgba(0,0,0,0.8)",
                          }}
                        ></i>
                      )}
                    </div>
                  )}

                  {/* IMAGEN Y TEXTO */}
                  {getFileType(foto.imagePath) === 'image' ? (
                    <img
                      src={foto.imageUrl}
                      alt={foto.descripcion || "Archivo de galería"}
                      className="card-img-top galeria-imagen"
                    />
                  ) : getFileType(foto.imagePath) === 'video' ? (
                    <video
                      controls
                      className="card-img-top galeria-imagen"
                      style={{ objectFit: 'contain', backgroundColor: '#000' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <source src={foto.imageUrl} />
                    </video>
                  ) : getFileType(foto.imagePath) === 'pdf' ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <iframe
                        src={foto.imageUrl}
                        className="card-img-top galeria-imagen"
                        style={{ border: 'none' }}
                        title={foto.descripcion || 'PDF'}
                      />
                      {!modoseleccion && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setFotoExtendida(foto) }}
                          title="Ampliar PDF"
                          className="galeria-expand-btn"
                        >
                          <i className="bi bi-arrows-fullscreen" />
                        </button>
                      )}
                    </div>
                  ) : getFileType(foto.imagePath) === 'audio' ? (
                    <div
                      className="galeria-imagen d-flex flex-column align-items-center justify-content-center"
                      style={{ backgroundColor: 'var(--color-grisOscuro)' }}
                    >
                      <i className="bi bi-music-note-beamed" style={{ fontSize: '2.5rem', color: 'var(--color1)' }}></i>
                      <audio controls style={{ width: '90%', marginTop: '8px' }} onClick={(e) => e.stopPropagation()}>
                        <source src={foto.imageUrl} />
                      </audio>
                    </div>
                  ) : (
                    <div
                      className="galeria-imagen d-flex flex-column align-items-center justify-content-center"
                      style={{ backgroundColor: 'var(--color-grisOscuro)' }}
                    >
                      <i className={`bi ${getFileIcon(foto.imagePath)}`} style={{ fontSize: '3rem', color: 'var(--color1)' }}></i>
                      <small style={{ color: 'var(--colorTexto)', wordBreak: 'break-all', textAlign: 'center', padding: '0 8px' }}>
                        {foto.imagePath?.split('/').pop() || 'archivo'}
                      </small>
                    </div>
                  )}

                  {!modoseleccion && getFileType(foto.imagePath) !== 'pdf' && (
                    <button
                      type="button"
                      className="galeria-download-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadStorageFile(foto.imagePath, foto.imagePath?.split('/').pop() || 'archivo')
                      }}
                      title="Descargar archivo"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                  )}

                  {(foto.personajeNombre || foto.descripcion) && (
                    <div
                      className="card-body p-2"
                      style={{ backgroundColor: "var(--color-grisOscuro)" }}
                    >
                      {foto.personajeNombre && (
                        <p
                          className="card-title m-0 fw-bold text-truncate"
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--colorTexto)",
                          }}
                        >
                          {foto.personajeNombre}
                        </p>
                      )}
                      {foto.descripcion && (
                        <p
                          className="m-0 text-truncate"
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--colorTexto)",
                            opacity: 0.75,
                          }}
                        >
                          {foto.descripcion}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">
              Aún no has subido archivos a la comunidad.
            </p>
          </div>
        )}
      </div>
      {fotoExtendida && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
          onClick={() => setFotoExtendida(null)}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "none",
              border: "none",
              color: "white",
              fontSize: "2rem",
              cursor: "pointer",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setFotoExtendida(null);
            }}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>

          {getFileType(fotoExtendida.imagePath) === 'pdf' ? (
            <iframe
              src={fotoExtendida.imageUrl}
              style={{
                width: '90vw',
                height: '85vh',
                border: 'none',
                borderRadius: '8px',
              }}
              title={fotoExtendida.descripcion || 'PDF'}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={fotoExtendida.imageUrl}
              alt={fotoExtendida.descripcion || "Foto expandida"}
              style={{
                maxHeight: "80vh",
                maxWidth: "100%",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {(fotoExtendida.personajeNombre || fotoExtendida.descripcion) && (
            <div
              style={{
                marginTop: "15px",
                color: "white",
                textAlign: "center",
                maxWidth: "80%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {fotoExtendida.personajeNombre && (
                <h4
                  style={{
                    fontFamily: "var(--texto-encabezados)",
                    color: "var(--color1)",
                    marginBottom: "5px",
                  }}
                >
                  {fotoExtendida.personajeNombre}
                </h4>
              )}
              {fotoExtendida.descripcion && (
                <p style={{ margin: 0, opacity: 0.8 }}>
                  {fotoExtendida.descripcion}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {modoseleccion && fotosEliminar.length > 0 && (
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ zIndex: 1000, animation: "slideUp 0.3s ease-out" }}
        >
          <div className="container px-0">
            <div className="d-flex justify-content-between align-items-center bg-danger text-white p-3 rounded-4 shadow-lg">
              <span className="fw-bold">
                {fotosEliminar.length} seleccionadas
              </span>
              <button
                className="btn btn-light btn-sm fw-bold rounded-pill text-danger px-4"
                onClick={eliminarFotos}
              >
                <i className="bi bi-trash3-fill me-1"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaUsuario;
