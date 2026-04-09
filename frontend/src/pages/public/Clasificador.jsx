import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useParams } from "react-router-dom";

//-------Helpers-------

// Función para obtener el valor de una relación, ya sea un objeto o un array
// La voy utilizare para obtener el nombre del universo
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

// Diccionario para mapear los tipos de MBTI a su grupo, rol y color correspondiente

const MBTI_DICT = {
  // Analistas (Morado)
  INTJ: { grupo: "Analistas", rol: "Arquitecto", color: "#88619A" },
  INTP: { grupo: "Analistas", rol: "Lógico", color: "#88619A" },
  ENTJ: { grupo: "Analistas", rol: "Comandante", color: "#88619A" },
  ENTP: { grupo: "Analistas", rol: "Innovador", color: "#88619A" },

  // Diplomáticos (Verde)
  INFJ: { grupo: "Diplomáticos", rol: "Abogado", color: "#33A474" },
  INFP: { grupo: "Diplomáticos", rol: "Mediador", color: "#33A474" },
  ENFJ: { grupo: "Diplomáticos", rol: "Protagonista", color: "#33A474" },
  ENFP: { grupo: "Diplomáticos", rol: "Activista", color: "#33A474" },

  // Centinelas (Azul/Celeste)
  ISTJ: { grupo: "Centinelas", rol: "Logista", color: "#4298B4" },
  ISFJ: { grupo: "Centinelas", rol: "Defensor", color: "#4298B4" },
  ESTJ: { grupo: "Centinelas", rol: "Ejecutivo", color: "#4298B4" },
  ESFJ: { grupo: "Centinelas", rol: "Cónsul", color: "#4298B4" },

  // Exploradores (Amarillo)
  ISTP: { grupo: "Exploradores", rol: "Virtuoso", color: "#F2C94C" },
  ISFP: { grupo: "Exploradores", rol: "Aventurero", color: "#F2C94C" },
  ESTP: { grupo: "Exploradores", rol: "Emprendedor", color: "#F2C94C" },
  ESFP: { grupo: "Exploradores", rol: "Animador", color: "#F2C94C" },
};

function Clasificador() {
  // Aquí lo que vamos a hacer es poner los datos estatícos que vamos a cargar en la página

  const { categoria } = useParams();

  const [Data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadingData = async () => {
      try {
        //Iniciamos la carga de los personajes con su universo y su tipo de MBTI
        setLoadingData(true);

        const { data, error } = await supabase.from("characters").select(`
            name,               
            slug,                   
            cover_path,         
            universes (name),  
            mbti_types (code, title)  
          `);

        if (error) throw error;

        //Aquí si no hay datos lo comprobamos
        if (!data || data.length === 0) {
          setData([]);
          return;
        }

        //Lo que vamos a hacer ahora es transformar o poner los datos para poderlos mostrar

        //--- Proceso seguido ---
        // 1. Creamos un objeto vacío donde vamos a agrupar los personajes por universo
        // 2. Recorremos los datos obtenidos en busca de los universos y los personajes
        // 3. Para cada personaje, obtenemos el nombre del universo al que pertenece
        // Si ese universo no existe se crea dentro del objeto con un array vacío
        // y si ya existe, simplemente se añade el personaje a ese universo dentro del objeto
        // 4. Para cada personaje, también obtenemos su nombre, imagen y tipo de MBTI para mostrarlo en la tarjeta
        // 5. Al final, tendremos un objeto con la estructura { universo1: [personaje1, personaje2], universo2: [personaje3, personaje4], ... }
        const clasificacion = {};

        data.forEach((personaje) => {
          let name = null;

          switch (categoria) {
            case "universos":
              name = getRelationValue(personaje.universes, "name");
              break;
            case "personalidades":
              name = getRelationValue(personaje.mbti_types, "code");
              break;
            case "psicologia":
              name = getRelationValue(personaje.mbti_types, "code");
              break;
            default:
              return; // Si el personaje no pertenece a ninguno de los universos que nos interesan, lo saltamos
          }

          if (!clasificacion[name]) clasificacion[name] = [];

          const personajeData = {
            id: personaje.slug, // Usamos el slug como ID único
            nombre: personaje.name,
            imagen: getCharacterCoverUrl(personaje.cover_path),
            mbti: getRelationValue(personaje.mbti_types, "code"),
          };

          clasificacion[name].push(personajeData);
        });

        // Una vez tengamos el objeto lo guardamos en nuestra variable de estado para mostrarlo en la página
        setData(
          Object.entries(clasificacion).map(([categoria, personajes]) => ({
            categoria,
            personajes,
          })),
        );
      } catch (error) {
        console.error("Error al cargar de los datos", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadingData();
  }, [categoria]);
  return (
    <div className="container mt-5 pt-4 mb-5">
      <div className="mb-5">
        <h1 className="home-section-title">
          {categoria === "universos"
            ? "Universos"
            : categoria === "personalidades"
              ? "Personalidades"
              : "Psicología"}
        </h1>
      </div>

      {loadingData ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : Data && Data.length > 0 ? (
        /* --- AQUI EMPIEZA EL MAP CON LLAVES { } --- */
        Data.map((grupo) => {
          // 1. Buscamos la info del MBTI. Si no existe (ej: Universos), ponemos un valor por defecto.
          const infoMbti = MBTI_DICT[grupo.categoria] || {
            grupo: "Otros",
            rol: "Desconocido",
            color: "var(--color-grisOscuro)",
          };

          // 2. Aquí devolvemos el HTML con el 'return'
          return (
            <div key={grupo.categoria} className="mb-5">
              {/* --- CABECERAS DINÁMICAS --- */}
              {categoria === "universos" ? (
                /* DISEÑO A: UNIVERSOS */
                <div className="d-flex justify-content-between align-items-end mb-3 px-2">
                  <h3
                    className="m-0"
                    style={{
                      color: "var(--color4)",
                      fontFamily: "var(--texto-encabezados)",
                      fontWeight: "bold",
                    }}
                  >
                    {grupo.categoria}
                  </h3>
                  <Link
                    to={`/categorias/${grupo.categoria}`}
                    className="text-decoration-none d-flex align-items-center gap-1 fw-bold"
                    style={{ color: "var(--colorTexto)", fontSize: "0.9rem" }}
                  >
                    Ver más <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              ) : (
                /* DISEÑO B: PERSONALIDADES (Caja coloreada) */
                <div
                  className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4 shadow-sm"
                  style={{ backgroundColor: infoMbti.color, color: "white" }}
                >
                  <div>
                    <p
                      className="m-0 mb-1 fw-bold text-uppercase opacity-75"
                      style={{ fontSize: "0.8rem", letterSpacing: "1px" }}
                    >
                      {infoMbti.grupo} {/* Ej: Analistas */}
                    </p>
                    <h3
                      className="m-0 fw-bold d-flex align-items-center gap-2"
                      style={{ fontFamily: "var(--texto-encabezados)" }}
                    >
                      {grupo.categoria}{" "}
                      <span className="fs-5 fw-normal opacity-75">
                        | {infoMbti.rol}
                      </span>
                    </h3>
                  </div>
                </div>
              )}

              {/* --- CONTENEDOR FILA DESLIZABLE (Común para ambos diseños) --- */}
              <div
                className="d-flex flex-nowrap overflow-x-auto gap-3 py-3 px-2"
                style={{ scrollBehavior: "smooth" }}
              >
                {grupo.personajes.map((personaje) => (
                  <Link
                    to={`/personaje/${personaje.id}`}
                    className="text-decoration-none"
                    key={personaje.id}
                  >
                    <div
                      className="card border-0 flex-shrink-0"
                      style={{
                        width: "240px",
                        backgroundColor: "var(--color-grisClaro)",
                        /* Quitamos el !important para que React lo lea bien */
                        border:
                          categoria === "personalidades"
                            ? `2px solid ${infoMbti.color}`
                            : "2px solid var(--color-grisOscuro)",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        /* La sombra también coge el color del MBTI si es Personalidades */
                        e.currentTarget.style.boxShadow =
                          categoria === "personalidades"
                            ? `0 8px 15px ${infoMbti.color}40`
                            : `0 8px 15px rgba(0,0,0,0.2)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <img
                        src={personaje.imagen}
                        alt={personaje.nombre}
                        className="card-img-top p-3"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "20px",
                        }}
                      />
                      <div className="card-body d-flex flex-column pt-0">
                        <span
                          className="align-self-start mb-2 px-2 py-1 rounded-1"
                          style={{
                            /* La etiqueta hereda el color del MBTI */
                            backgroundColor:
                              categoria === "personalidades"
                                ? infoMbti.color
                                : "var(--color5)",
                            color:
                              categoria === "personalidades"
                                ? "white"
                                : "var(--color-principal)",
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                          }}
                        >
                          {personaje.mbti}
                        </span>
                        <h5
                          className="card-title m-0"
                          style={{
                            color: "var(--color3)",
                            fontFamily: "var(--texto-encabezados)",
                          }}
                        >
                          {personaje.nombre}
                        </h5>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        /* --- AQUÍ TERMINA EL MAP CON LLAVES --- */

        <p>No hay personajes disponibles.</p>
      )}
    </div>
  );
}

export default Clasificador;
