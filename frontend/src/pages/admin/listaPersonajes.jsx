import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import characterService from '../../services/characterService'
import '../../assets/styles/adminPersonajes.css'

function BackBtn({ onClick, to }) {
  const icon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
         viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
  if (to) return <Link to={to} className="admin-cat-back-btn" aria-label="Volver">{icon}</Link>
  return (
    <button type="button" className="admin-cat-back-btn" onClick={onClick} aria-label="Volver">
      {icon}
    </button>
  )
}

function ListaPersonajes() {
  
  const [personajes, setPersonajes] = useState([]);
  const [loading, setLoading] = useState(true); // Para mostrar un spinner de carga mientras obtenemos los datos
 
  useEffect(() => {
    const cargarPersonajesLista = async () => {
      setLoading(true)

      try {
        const data = await characterService.getAdminCharactersList()
        setPersonajes(data)
      } catch (error) {
        console.error("Error al cargar personajes:", error)
        setPersonajes([])
      } finally {
        setLoading(false)
      }
    }

    cargarPersonajesLista()
  }, []);

  const navigate = useNavigate();

  return (
    // Contenedor principal oscuro
    <div
      className="container-fluid pb-5"
      style={{ backgroundColor: "var(--color-principal)", minHeight: "100vh", color: "var(--colorTexto)" }}
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
              className="btn rounded-pill fw-bold px-4 py-2 d-inline-flex align-items-center gap-2 shadow btnCrearPers"
              onClick={() => navigate("/admin/formulario-personaje")}
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
              <p className="mt-3" style={{ color: "var(--colorTexto)", fontSize: "1.1rem", fontFamily: "var(--texto-normal)" }}>
                Cargando personajes...
              </p>
            </div>
          ) : personajes.length === 0 ? (
            /* --- MENSAJE CUANDO NO HAY PERSONAJES --- */
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "300px" }}>
              <p style={{ color: "var(--colorTexto)", fontSize: "1.3rem", fontWeight: "bold", fontFamily: "var(--texto-normal)"}}>
                No hay personajes disponibles
              </p>
              <p style={{ color: "var(--colorTexto)", fontSize: "1rem", fontFamily: "var(--texto-normal)" }}>
                Crea uno nuevo para comenzar
              </p>
            </div>
          ) : (
            /* --- LISTA DE TARJETAS --- */
            <div className="d-flex flex-column gap-3 px-2">
              {personajes.map((personaje) => (
                <div
                  key={personaje.id}
                  className="card border-0 p-3 shadow-sm"
                  style={{
                    backgroundColor: "var(--color-grisOscuro)",
                    borderRadius: "25px",
                  }}
                >
                  <div className="d-flex align-items-start gap-3">
                    {/* 1. Imagen cuadrada con bordes redondeados */}
                    <img
                      src={personaje.imagen}
                      alt={personaje.name}
                      className="bg-white" // Fondo blanco por si la imagen tiene transparencias 
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
                          color: "var(--color3)",
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
                          color: "var(--colorTexto)",
                          fontFamily: "var(--texto-normal)",
                        }}
                      >
                        {personaje.descripcion}
                      </p>

                      <div className="d-flex justify-content-center gap-2 mt-auto pt-2 flex-wrap">
                        {/* Botón Editar */}
                        <button
                          className="btn rounded-pill px-4 btnEditarPers"
                          onClick={() =>
                            navigate(`/admin/formulario-personaje/${personaje.id}`, {
                              state: { personaje },
                            })
                          }
                        >
                          <i className="bi bi-pencil fs-5 iconEditar"></i>
                        </button>

                        {/* Botón Eliminar*/}
                        <button
                          className="btn rounded-pill px-4 btnEliminarPers"
                          onClick={() =>
                            navigate(`/admin/eliminar-personaje/${personaje.id}`, {
                              state: { personaje },
                            })
                          }
                        >
                          <i className="bi bi-trash fs-5 iconEliminar"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* --- BOTÓN VOLVER --- */}
          <div className="mt-4 d-flex justify-content-start">
            <BackBtn to="/admin" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListaPersonajes;