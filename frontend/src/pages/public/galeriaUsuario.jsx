import React, { use, useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import "../../assets/styles/galeria.css";
import userService from "../../services/userService";
// import { Modal } from "bootstrap";

// ------- Helper functions -------

// Función para obtener el valor de una relación, ya sea un objeto o un array
// La voy utilizare para obtener el nombre del universo
// function getRelationValue(relation, field) {
//   if (Array.isArray(relation)) {
//     return relation[0]?.[field];
//   }
//   return relation?.[field];
// }

// // Función para obtener la URL pública de una imagen almacenada en Supabase Storage
// function getGalleryImageUrl(filePath) {
//   if (!filePath) return null;

//   const { data } = supabase.storage.from("gallery").getPublicUrl(filePath);

//   return data.publicUrl;
// }

const GaleriaUsuario = () => {
  // Vamos a utilizar estos estados para poder mostrar las fotos del usuario y un indicador de carga mientras se obtienen los datos
  const [fotos, setFotos] = useState([]);
  const [loadingFotos, setLoading] = useState(true);

  const [fotoExtendida, setFotoExtendida] = useState(null);

  const [modoseleccion, setModoseleccion] = useState(false);

  const [fotosEliminar, setFotosEliminar] = useState([]);
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
      {/* pb-5 da espacio para que la barra inferior no tape la última foto */}
      {/* --- CABECERA --- */}
      <header className="d-flex justify-content-between align-items-center mb-4 px-2">
        <h2
          style={{
            fontFamily: "var(--texto-encabezados)",
            color: "var(--color1)",
          }}
        >
          Mi Galería
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
                    cursor: modoseleccion ? "pointer" : "default", // Cambia el cursor según el modo
                    transform: estaSeleccionada ? "scale(0.95)" : "scale(1)", // Efecto "hundido" si se selecciona
                    transition: "all 0.2s ease",
                    border: estaSeleccionada
                      ? "3px solid var(--color1)"
                      : "3px solid transparent",
                  }}
                  onClick={() => {
                    // Si estamos en modo selección, toda la tarjeta funciona como botón
                    if (modoseleccion) {
                      toggleSeleccionFoto(foto.id);
                    } else {
                      // Aquí en el futuro puedes poner la lógica para abrir la foto en grande
                      setFotoExtendida(foto);
                    }
                  }}
                >
                  {/* OVERLAY OSCURO (Solo si está seleccionada) */}
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
                  <img
                    src={foto.imageUrl}
                    alt={foto.descripcion || "Foto de galería"}
                    className ="card-img-top galeria-imagen"
                  />

                  {foto.personajeNombre && (
                    <div
                      className="card-body p-2"
                      style={{ backgroundColor: "var(--color-grisOscuro)" }}
                    >
                      <p
                        className="card-title m-0 fw-bold text-truncate"
                        style={{
                          fontSize: "0.9rem",
                          color: "var(--colorTexto)",
                        }}
                      >
                        {foto.personajeNombre}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">
              Aún no has subido fotos a la comunidad.
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
      {/* --- LA TRAMPA DEL PULGAR (Barra Inferior Fija) --- */}
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
