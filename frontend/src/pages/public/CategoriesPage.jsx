// Página de categorías: por Universo, Personalidad o Tipo MBTI
// Cada categoría incluye descripción, personajes populares y listado completoç
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

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

// 1. El estado que controla qué número de personaje estamos viendo (empezamos en el 0)
function CategoriesPage() {
  const { universo } = useParams();
  const navigate = useNavigate();

  //Estos son los estados que van a controlar los datos que cargamos y su estado de carga
  const [Data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [personajeActual, setPersonajeActual] = useState(0);

  //Estos son los personajes populares que vamos a mostrar en el carrusel (puedes cargarlos dinámicamente también)

  useEffect(() => {
    const loadingData = async () => {
      try {
        // Iniciamos la carga del universo con su descripcion y su imagen
        setLoadingData(true);

        const { data: universeData, error: universeError } = await supabase
          .from("universes")
          .select(
            `name, 
            description, 
            image_path, 
            characters (
              id,
              name, 
              slug, 
              cover_path, 
              mbti_types (code))`,
          )
          .eq("name", universo)
          .single(); // <-- Usamos .single() porque esperamos un solo universo

        if (universeError) throw universeError;

        // Aquí si no hay datos lo comprobamos
        if (!universeData || universeData.length === 0) {
          setData([]);
          return;
        }

        //Ahora lo que vamos a hacer es iniciar el filtrado de los personajes por favoritos
        //Extraemos solo los IDs de los personajes del universo obtenido
        const characterIds = universeData.characters.map((c) => c.id);

        //Ahora realizamos la peticion a la base de datos para obtener los personajes que son favoritos de este universo
        let favData = [];
        if (characterIds.length > 0) {
          const { data: favCharacters, error: favError } = await supabase
            .from("character_favorite_counts")
            .select("character_id, total_favorites")
            .in("character_id", characterIds); // <-- Este es el parametro que filtra por los IDs de personajes

          if (favError) throw favError;

          if (!favError && favCharacters) {
            favData = favCharacters;
          }
        }

        // Ahora lo que vamos a hacer es transformar o poner los datos para poderlos mostrar poniendo todos los personajes
        const todosLosPersonajes = universeData.characters.map((pesonajes) => {
          // Buscamos si estos personajes tiene registro en la tabla de favoritos para obtener su numero de favoritos
          const fav = favData.find((f) => f.character_id === pesonajes.id);

          return {
            id: pesonajes.id,
            name: pesonajes.name,
            slug: pesonajes.slug,
            coverUrl: getCharacterCoverUrl(pesonajes.cover_path), // <-- Obtenemos la URL de la imagen de portada
            mbtiType: getRelationValue(pesonajes.mbti_types, "code"), // <-- Obtenemos el código del tipo MBTI
            totalFavorites: fav ? fav.total_favorites : 0, // <-- Si no tiene registro de favoritos, ponemos 0
          };
        });

        // Ordenamos de mayor a menor por número de favoritos
        todosLosPersonajes.sort((a, b) => b.totalFavorites - a.totalFavorites);

        // Ahora dividimos para que no se muestre el carrusel en explora más personajes
        const personajesPopulares = todosLosPersonajes.slice(0, 3); // <-- Tomamos los 3 personajes más populares para el carrusel
        const personajesRestantes = todosLosPersonajes.slice(3); // <-- El resto de personajes para la sección de explorar más

        // Ahora guardamos estos datos en estados separados para usarlos en cada seccion

        setData({
          name: universeData.name,
          description: universeData.description,
          imageUrl: universeData.image_path
            ? getUniverseImageUrl(universeData.image_path)
            : todosLosPersonajes[0]?.coverUrl || null, // <-- Obtenemos la URL de la imagen del universo o usamos la del personaje más popular como fallback
          populares: personajesPopulares, // <-- Guardamos los personajes populares para el carrusel
          explorar: personajesRestantes, // <-- Guardamos el resto de personajes para la sección de explorar más
        });
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadingData();
  }, [universo]); // <-- El efecto se vuelve a ejecutar cada vez que cambia el universo seleccionado

  // Funciones del carrusel (asegúrate de que Data.characters existe antes de usarlas)
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
      style={{ backgroundColor: "black", minHeight: "100vh", color: "white" }}
    >
      <div className="row justify-content-center pt-4">
        <div className="col-12 col-md-10 col-lg-8">
          {/* --- BLOQUE 1: CABECERA (HERO) --- */}
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
              {/* --- BLOQUE 1: CABECERA (HERO) --- */}
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
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    textAlign: "justify",
                  }}
                >
                  {Data.description || "Descripción no disponible."}
                </p>
              </div>
              {/* --- BLOQUES 2 Y 3 (Solo se muestran si hay personajes populares) --- */}
              {Data.populares && Data.populares.length > 0 && (
                <>
                  {/* --- BLOQUE 2: PERSONAJES POPULARES (Carrusel) --- */}
                  <h3
                    className="mb-4 ps-3"
                    style={{
                      color: "var(--color3)",
                      fontFamily: "var(--texto-encabezados)",
                      borderLeft: "5px solid var(--color3)",
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
                      // ... (AQUÍ VA TODA TU LÓGICA DEL CARRUSEL QUE ESTABA PERFECTA) ...
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
                                color: "var(--color1)",
                              }}
                            >
                              {personaje.name}
                            </h5>
                            <img
                              src={personaje.coverUrl}
                              alt={personaje.name}
                              className="img-fluid my-2"
                              style={{ height: "200px", objectFit: "contain" }}
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
                                style={{ color: "var(--color1)" }}
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

                  {/* --- BLOQUE 3: EXPLORA MÁS PERSONAJES (Lista) --- */}
                  <h3
                    className="mb-4 ps-3"
                    style={{
                      color: "var(--color5)",
                      fontFamily: "var(--texto-encabezados)",
                      borderLeft: "5px solid var(--color5)",
                    }}
                  >
                    EXPLORA MÁS PERSONAJES
                  </h3>

                  <div className="d-flex flex-column gap-3">
                    {/* Aquí aplicamos el ternario limpio */}
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
                                  color: "white",
                                  border: "2px solid white",
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
                                  color: "var(--color1)",
                                }}
                              >
                                {personaje.name}
                              </h4>
                              <div className="mt-auto">
                                <span
                                  className="text-decoration-none fw-bold"
                                  style={{ color: "var(--color1)" }}
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
                    {/* <-- Cierre correcto del ternario */}
                  </div>
                </>
              )}{" "}
              {/* <-- Cierre correcto del bloque de "Si hay personajes populares dibuja el bloque 2 y 3" */}
              <div className="mt-5 mb-3">
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
