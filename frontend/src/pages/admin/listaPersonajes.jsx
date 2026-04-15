import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

//------------- Helpers -------------
function getRelationValue(relation, field) {
  if (Array.isArray(relation)) {
    return relation[0]?.[field];
  }
  return relation?.[field];
}

// Función para obtener la URL pública de una imagen almacenada en Supabase Storage
function getCharacterCoverUrl(coverPath) {
  if (!coverPath) return null;

  const { data } = supabase.storage
    .from("character-covers")
    .getPublicUrl(coverPath);

  return data.publicUrl;
}

// Función para obtener la URL pública de una imagen almacenada en Supabase Storage
function getUniverseImageUrl(coverPath) {
  if (!coverPath) return null;

  const { data } = supabase.storage
    .from("universes_images")
    .getPublicUrl(coverPath);

  return data.publicUrl;
}

function listaPersonajes() {
  //----------------------------- Objetos para guardar los datos que recogamos de la base de datos -----------------------------

  const [personajes, setPersonajes] = useState([]);
  const [loading, setLoading] = useState(true); // Para mostrar un spinner de carga mientras obtenemos los datos
  // Aquí con
  useEffect(() => {
    // Función para cargar los personajes desde la base de datos
    const cargarPersonajesLista = async () => {
      setLoading(true);

      try {
        const { data: personajesData, error } = await supabase.from(
          "characters",
        ).select(`id,
                name, 
                slug, 
                cover_path, 
                mbti_types (code)`);

        // Si hay un error
        if (error) throw error;

        // Transformamos los datos para incluir la URL pública de la imagen
        const personajesConUrl = personajesData.map((personaje) => ({
          id: personaje.id,
          name: personaje.name,
          slug: personaje.slug,
          descripcion:
            getRelationValue(personaje.mbti_types, "code") || "Desconocido",
          imagen:
            getCharacterCoverUrl(personaje.cover_path) ||
            "https://via.placeholder.com/150", // URL de una imagen por defecto si no hay cover
        }));

        // Guardamos los personajes con la URL de la imagen en el estado
        setPersonajes(personajesConUrl);
      } catch (error) {
        console.error("Error al cargar personajes:", error);
      } finally {
        // Aquí podríamos hacer algo al finalizar la carga, como ocultar un spinner de carga
        setLoading(false);
      }
    };
    cargarPersonajesLista();
  }, []);

  const navigate = useNavigate();

  return (
    // Contenedor principal oscuro
    <div
      className="container-fluid pb-5"
      style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}
    >
      <div className="row justify-content-center pt-4">
        <div className="col-12 col-md-8 col-lg-6">
          {/* --- TÍTULO --- */}
          <h1
            className="text-center mb-3 text-uppercase"
            style={{
              fontFamily: "var(--texto-encabezados)",
              color: "var(--color1)",
              fontSize: "2.5rem",
            }}
          >
            Lista de Personajes
          </h1>

          {/* --- BOTÓN CREAR NUEVO --- */}
          <div className="text-center mb-4">
            <button
              className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 shadow"
              style={{
                backgroundColor: "#5bc0be",
                color: "#000",
                border: "2px solid #4a9e9c",
              }} // Ese verde azulado de tu captura
              onClick={() => navigate("/formulario-personaje")}
            >
              CREAR NUEVO <i className="bi bi-plus-circle fs-5"></i>
            </button>
          </div>
              
          {/* --- EFECTO DE CARGA --- */}
          {loading ? (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
              <div className="spinner-border text-info" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3" style={{ color: "var(--color1)", fontSize: "1.1rem" }}>
                Cargando personajes...
              </p>
            </div>
          ) : personajes.length === 0 ? (
            /* --- MENSAJE CUANDO NO HAY PERSONAJES --- */
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
              <p style={{ color: "var(--color1)", fontSize: "1.3rem", fontWeight: "bold" }}>
                No hay personajes disponibles
              </p>
              <p style={{ color: "#b0b0b0", fontSize: "1rem" }}>
                Crea uno nuevo para comenzar
              </p>
            </div>
          ) : (
            /* --- LISTA DE TARJETAS --- */
            <div className="d-flex flex-column gap-3 px-2">
              {personajes.map((personaje) => (
                /* Tarjeta de Bootstrap adaptada a tu diseño */
                <div
                  key={personaje.id}
                  className="card border-0 p-3 shadow-sm"
                  style={{
                    backgroundColor: "var(--color-grisOscuro, #2a2a2a)",
                    borderRadius: "25px",
                  }}
                >
                  {/* Usamos d-flex para poner foto a la izquierda y textos a la derecha */}
                  <div className="d-flex align-items-start gap-3">
                    {/* 1. Imagen cuadrada con bordes redondeados */}
                    <img
                      src={personaje.imagen}
                      alt={personaje.name}
                      className="bg-white" // Fondo blanco por si la imagen tiene transparencias (como Maléfica)
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                    />

                    {/* 2. Contenido (Título, Descripción y Botones) */}
                    <div className="d-flex flex-column flex-grow-1">
                      <h3
                        className="m-0 text-uppercase"
                        style={{
                          fontFamily: "var(--texto-encabezados)",
                          color: "var(--color1)",
                          fontSize: "1.5rem",
                        }}
                      >
                        {personaje.name}
                      </h3>

                      <p
                        className="mt-1 mb-2"
                        style={{
                          fontSize: "0.85rem",
                          lineHeight: "1.3",
                          color: "#e0e0e0",
                        }}
                      >
                        {personaje.descripcion}
                      </p>

                      {/* Contenedor de los botones Editar y Eliminar centrados bajo el texto */}
                      <div className="d-flex justify-content-center gap-3 mt-auto pt-2">
                        {/* Botón Editar (Verde Neón) */}
                        <button
                          className="btn rounded-pill px-4"
                          style={{
                            backgroundColor: "var(--color1)",
                            border: "2px solid #85c249",
                          }}
                          onClick={() =>
                            navigate("/admin/formulario-personaje", {
                              state: { personaje },
                            })
                          } // Aquí iría la función real de edición, pasando el ID del personaje
                        >
                          <i className="bi bi-pencil fs-5 text-dark"></i>
                        </button>

                        {/* Botón Eliminar (Rosa Fucsia) */}
                        <button
                          className="btn rounded-pill px-4"
                          style={{
                            backgroundColor: "#ff1493",
                            border: "2px solid #c91074",
                          }}
                          onClick={() =>
                            navigate("/admin/eliminar-personaje", {
                              state: { personaje },
                            })
                          } // Aquí iría la función real de eliminación
                        >
                          <i className="bi bi-trash fs-5 text-white"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- BOTÓN VOLVER (Abajo a la izquierda) --- */}
          <div className="mt-4 ms-2">
            <button
              onClick={() => navigate(-1)}
              className="btn border-0 p-0"
              style={{ color: "var(--color1)" }}
            >
              <i
                className="bi bi-arrow-left-circle-fill"
                style={{ fontSize: "2.5rem" }}
              ></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default listaPersonajes;
