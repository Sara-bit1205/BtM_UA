// Página de categorías: por Universo, Personalidad o Tipo MBTI
// Cada categoría incluye descripción, personajes populares y listado completoç
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import '../../assets/styles/comunInfo.css';
import categoryService from '../../services/categoryService';


// 1. El estado que controla qué número de personaje estamos viendo (empezamos en el 0)
function CategoriesPage() {
  const { universo } = useParams();
  const navigate = useNavigate();

  //Estos son los estados que van a controlar los datos que cargamos y su estado de carga
  const [Data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [personajeActual, setPersonajeActual] = useState(0);

  //Estos son los personajes populares que vamos a mostrar en el carrusel 

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true)

        const universeDetail = await categoryService.getUniverseDetail(universo)

        if (!universeDetail) {
          setData(null)
          return
        }

        setData(universeDetail)
      } catch (error) {
        console.error("Error al cargar los datos:", error)
        setData(null)
      } finally {
        setLoadingData(false)
      }
    }

    loadData()
  }, [universo]) 

  // Funciones del carrusel 
  const irAlSiguiente = () => {
    if (Data && Data.populares) {
      setPersonajeActual((prev) => (prev + 1) % Data.populares.length);
    }
  };

  const irAlAnterior = () => {
    if (Data && Data.populares) {
      setPersonajeActual(
        (prev) => (prev - 1 + Data.populares.length) % Data.populares.length,
      );
    }
  };

  return (
    // Contenedor principal oscuro
    <div
      className="container-fluid pb-5"
      style={{ backgroundColor: "var(--color-principal)", minHeight: "100vh", color: "var(--colorTexto)" }}
    >
      <div className="row justify-content-center pt-4">
        <div className="col-12 col-md-10 col-lg-8">
          {/* --- BLOQUE 1: CABECERA  --- */}
          {loadingData ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : Data ? (
            <>
              {/* --- BLOQUE 1: CABECERA --- */}
              <div
                className="p-4 mb-4"
                style={{
                  backgroundColor: "var(--color-grisOscuro)",
                  borderRadius: "20px",
                }}
              >
                <div className="text-center mb-4">
                  <img
                    src={Data.imageUrl}
                    alt={Data.name}
                    className="img-fluid shadow"
                    style={{
                      borderRadius: "30px",
                      border: "6px solid var(--color1)",
                      maxHeight: "300px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <h1
                  style={{
                    fontFamily: "var(--texto-encabezados)",
                    color: "var(--color1)",
                    fontSize: "3rem",
                    textTransform: "uppercase",
                    margin: 0,
                  }}
                >
                  {Data.name}
                </h1>
                <h4
                  style={{
                    color: "var(--color4)",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                >
                  Categoría
                </h4>
                <p
                  style={{
                    fontSize: "clamp(0.5rem, 1.1rem)",
                    lineHeight: "1.6",
                    textAlign: "justify",
                    color: "var(--colorTexto)",
                  }}
                >
                  {Data.description || "Descripción no disponible."}
                </p>
              </div>
              {/* --- BLOQUES 2 Y 3 --- */}
              {Data.populares && Data.populares.length > 0 && (
                <>
                  {/* --- BLOQUE 2: PERSONAJES POPULARES --- */}
                  <h3
                    className="mb-4 ps-3"
                    style={{
                      color: "var(--color1)",
                      fontFamily: "var(--texto-encabezados)",
                      borderLeft: "5px solid var(--color1)",
                    }}
                  >
                    PERSONAJES POPULARES
                  </h3>

                  <div
                    className="d-flex justify-content-center align-items-center mb-5 position-relative overflow-hidden"
                    style={{ height: "350px", width: "100%" }}
                  >
                    <button
                      onClick={irAlAnterior}
                      className="btn text-white position-absolute start-0 z-3 fs-1 border-0"
                      style={{ padding: "0 10px" }}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </button>

                    {Data.populares.map((personaje, index) => {
                      let distancia = index - personajeActual;
                      if (
                        personajeActual === 0 &&
                        index === Data.populares.length - 1
                      )
                        distancia = -1;
                      if (
                        personajeActual === Data.populares.length - 1 &&
                        index === 0
                      )
                        distancia = 1;

                      let estilosAnimados = {};
                      if (distancia === 0)
                        estilosAnimados = {
                          transform: "translateX(0) scale(1)",
                          zIndex: 3,
                          opacity: 1,
                          filter: "brightness(1)",
                        };
                      else if (distancia === 1)
                        estilosAnimados = {
                          transform: "translateX(45%) scale(0.85)",
                          zIndex: 2,
                          opacity: 0.6,
                          filter: "brightness(0.5)",
                        };
                      else if (distancia === -1)
                        estilosAnimados = {
                          transform: "translateX(-45%) scale(0.85)",
                          zIndex: 2,
                          opacity: 0.6,
                          filter: "brightness(0.5)",
                        };
                      else
                        estilosAnimados = {
                          transform: "translateX(0) scale(0.5)",
                          zIndex: 1,
                          opacity: 0,
                          pointerEvents: "none",
                        };

                      return (
                        <div
                          key={personaje.id}
                          className="text-center p-3 position-absolute"
                          onClick={() => {
                            if (distancia === 1) irAlSiguiente();
                            if (distancia === -1) irAlAnterior();
                          }}
                          style={{
                            backgroundColor: "var(--color-grisOscuro)",
                            borderRadius: "30px",
                            width: "60%",
                            maxWidth: "300px",
                            boxShadow:
                              distancia === 0
                                ? "0 10px 20px rgba(0,0,0,0.5)"
                                : "none",
                            transition:
                              "all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
                            cursor: distancia === 0 ? "default" : "pointer",
                            ...estilosAnimados,
                          }}
                        >
                          <Link
                            to={`/personaje/${personaje.slug}`}
                            className="text-decoration-none"
                          >
                            <h5
                              style={{
                                fontFamily: "var(--texto-encabezados)",
                                color: "var(--color3)",
                              }}
                            >
                              {personaje.name}
                            </h5>
                            <img
                              src={personaje.coverUrl}
                              alt={personaje.name}
                              className="img-fluid my-2"
                              style={{ height: "clamp(90px, 200px)", objectFit: "contain" }}
                            />
                            <div
                              className="mt-2"
                              style={{
                                opacity: distancia === 0 ? 1 : 0,
                                transition: "opacity 0.2s",
                              }}
                            >
                              <span
                                className="text-decoration-none fw-bold"
                                style={{ color: "var(--color4)" }}
                              >
                                <i
                                  className="bi bi-circle-fill"
                                  style={{
                                    fontSize: "0.5rem",
                                    verticalAlign: "middle",
                                    marginRight: "5px",
                                  }}
                                ></i>
                                Saber más
                              </span>
                            </div>
                          </Link>
                        </div>
                      );
                    })}

                    <button
                      onClick={irAlSiguiente}
                      className="btn text-white position-absolute end-0 z-3 fs-1 border-0"
                      style={{ padding: "0 10px" }}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </button>
                  </div>

                  {/* --- BLOQUE 3: EXPLORA MÁS PERSONAJES--- */}
                  <h3
                    className="mb-4 ps-3"
                    style={{
                      color: "var(--color1)",
                      fontFamily: "var(--texto-encabezados)",
                      borderLeft: "5px solid var(--color1)",
                    }}
                  >
                    EXPLORA MÁS PERSONAJES
                  </h3>

                  <div className="d-flex flex-column gap-3">
                    {Data.explorar && Data.explorar.length > 0 ? (
                      Data.explorar.map((personaje) => (
                        <Link
                          to={`/personaje/${personaje.slug}`}
                          className="text-decoration-none"
                          key={personaje.id}
                        >
                          <div
                            className="d-flex p-2"
                            style={{
                              backgroundColor: "var(--color-grisOscuro)",
                              borderRadius: "20px",
                            }}
                          >
                            <div
                              className="position-relative"
                              style={{ minWidth: "120px" }}
                            >
                              <img
                                src={personaje.coverUrl}
                                alt={personaje.name}
                                style={{
                                  width: "120px",
                                  height: "160px",
                                  objectFit: "cover",
                                  borderRadius: "15px",
                                }}
                              />
                              <div
                                className="position-absolute bottom-0 start-0 m-2 px-2 py-1 rounded-2 fw-bold"
                                style={{
                                  backgroundColor: "rgba(0,0,0,0.7)",
                                  color: "var(--color5)",
                                  border: "2px solid var(--color5)",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {personaje.mbtiType}
                              </div>
                            </div>
                            <div className="ms-3 d-flex flex-column justify-content-center py-2 pe-2">
                              <h4
                                className="m-0 text-uppercase"
                                style={{
                                  fontFamily: "var(--texto-encabezados)",
                                  color: "var(--color3)",
                                }}
                              >
                                {personaje.name}
                              </h4>
                              <div className="mt-auto">
                                <span
                                  className="text-decoration-none fw-bold"
                                  style={{ color: "var(--color4)" }}
                                >
                                  <i
                                    className="bi bi-circle-fill"
                                    style={{
                                      fontSize: "0.5rem",
                                      verticalAlign: "middle",
                                      marginRight: "5px",
                                    }}
                                  ></i>
                                  Saber más
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "100px" }}
                      >
                        <p className="text-muted">
                          No hay más personajes para explorar en este universo.
                        </p>
                      </div>
                    )}{" "}
                    
                  </div>
                </>
              )}{" "}
              
              <div className="mt-5 mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="btn border-0 p-0 volverCat"
                >
                  <i
                    className="bi bi-arrow-left-circle-fill"
                    style={{ fontSize: "2.5rem" }}
                  ></i>
                </button>
              </div>
            </>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ height: "200px" }}
            >
              <p className="text-muted">
                No se encontraron datos para este universo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
