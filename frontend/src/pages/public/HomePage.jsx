// Página principal — accesible sin autenticación
// Punto de entrada: muestra bienvenida, accesos a Menú Lateral y búsqueda

import { Link } from 'react-router-dom';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';
import '../../assets/styles/home.css';

//--------------------
import maleficaImg from '../../assets/images/malefica.jpg';
import spidermanImg from '../../assets/images/spiderman.jpg';
import elsaImg from '../../assets/images/elsa.png';
import batmanImg from '../../assets/images/batman.jpg';

import arquitectoIcono from '../../assets/images/bricks.svg';
//---------------------

function getCharacterCoverUrl(coverPath) {
  if (!coverPath) return null;

  const { data } = supabase.storage
    .from('character-covers')
    .getPublicUrl(coverPath);

  return data.publicUrl;
}

// Devuelve un número estable según la fecha de hoy
function getDailyCharacterIndex(total) {
  if (!total) return 0;

  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % total;
  }

  return Math.abs(hash) % total;
}

const personajesPopulares = [
  {
    slug: "malefica",
    nombre: "MALÉFICA",
    universo: "Universo Disney",
    mbti: "INTJ",
    imagen: maleficaImg,
  },
  {
    slug: "spiderman",
    nombre: "SPIDERMAN",
    universo: "Universo Marvel",
    mbti: "INTJ",
    imagen: spidermanImg,
  },
  {
    slug: "batman",
    nombre: "BATMAN",
    universo: "Universo DC",
    mbti: "INTJ",
    imagen: batmanImg,
  },
  {
    slug: "elsa",
    nombre: "ELSA",
    universo: "Universo Disney",
    mbti: "INFJ",
    imagen: elsaImg,
  },
];

const personalidades = [
  {
    tipo: "INTJ",
    descripcion: "Arquitecto/a",
    icono: arquitectoIcono,
  },
];

function agruparItems(items, size) {
  const grupos = [];
  for (let i = 0; i < items.length; i += size) {
    grupos.push(items.slice(i, i + size));
  }
  return grupos;
}

function HomePage() {
  const getItemsPerSlide = () => {
    const width = window.innerWidth;
    if (width >= 992) return 3; // lg
    if (width >= 768) return 2; // md
    return 1; // móvil
  };

  const [itemsPorSlide, setItemsPorSlide] = useState(getItemsPerSlide());
  const [personajeDelDia, setPersonajeDelDia] = useState(null);
  const [loadingPersonajeDelDia, setLoadingPersonajeDelDia] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setItemsPorSlide(getItemsPerSlide());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadPersonajeDelDia = async () => {
      try {
        setLoadingPersonajeDelDia(true);

        const { data, error } = await supabase
          .from('characters')
          .select(`
            name,
            slug,
            cover_path,
            universes (
              name
            ),
            mbti_types (
              code
            )
          `)
          .order('name', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
          setPersonajeDelDia(null);
          return;
        }

        const index = getDailyCharacterIndex(data.length);
        const selectedCharacter = data[index];

        setPersonajeDelDia({
          slug: selectedCharacter.slug,
          nombre: selectedCharacter.name,
          universo: selectedCharacter.universes?.name || 'Sin universo',
          mbti: selectedCharacter.mbti_types?.code || '—',
          imagen: getCharacterCoverUrl(selectedCharacter.cover_path) || maleficaImg,
        });
      } catch (error) {
        console.error('Error cargando personaje del día:', error.message);

        setPersonajeDelDia({
          slug: "malefica",
          nombre: "Maléfica",
          universo: "Disney",
          mbti: "INTJ",
          imagen: maleficaImg,
        });
      } finally {
        setLoadingPersonajeDelDia(false);
      }
    };

    loadPersonajeDelDia();
  }, []);

  const gruposPersonajes = useMemo(() => {
    return agruparItems(personajesPopulares, itemsPorSlide);
  }, [itemsPorSlide]);

  return (
    <main className="container py-4 home-page">
      <div className="row g-5">
        {/* PERSONAJE DEL DÍA */}
        <div className="col-12">
          <h1 className="home-section-title mb-3 text-center">PERSONAJE DEL DÍA</h1>

          {loadingPersonajeDelDia ? (
            <p className="text-center">Cargando personaje del día...</p>
          ) : personajeDelDia ? (
            <div className="card text-bg-dark card-personaje-del-dia">
              <Link className="nav-link" to={`/personaje/${personajeDelDia.slug}`}>
                <img
                  src={personajeDelDia.imagen}
                  className="card-img card-personaje-del-dia-img"
                  alt={personajeDelDia.nombre}
                />
              </Link>
              <div className="card-img-overlay d-flex flex-column justify-content-end personaje-del-dia-overlay">
                <div className="d-flex justify-content-between align-items-end">
                  <div>
                    <Link className="nav-link" to={`/personaje/${personajeDelDia.slug}`}>
                      <h3 className="card-title mb-1 text-uppercase fw-bold nombre-del-dia">
                        {personajeDelDia.nombre}
                      </h3>
                    </Link>
                    <Link className="nav-link" to={`/categorias/${personajeDelDia.universo.toLowerCase().replace(/\s+/g, '-')}`}>
                      <p className="card-text mb-0">
                        Universo {personajeDelDia.universo}
                      </p>
                    </Link>
                  </div>

                  <Link className="nav-link" to="/categorias/:id">
                    <span className="badge rounded-pill home-mbti-badge mr-2">
                      {personajeDelDia.mbti}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">No hay personaje del día disponible.</p>
          )}
        </div>

        {/* PERSONAJES MÁS POPULARES */}
        <div className="col-12">
          <div
            id="popularCharactersCarousel"
            className="carousel slide popular-carousel"
            data-bs-ride="carousel"
          >
            <h1 className="home-section-title mb-3 text-center">PERSONAJES POPULARES</h1>

            <div className="carousel-inner">
              {gruposPersonajes.map((grupo, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? 'active' : ''}`}
                >
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {grupo.map((personaje) => (
                      <div className="col" key={personaje.slug}>
                        <div className="card popular-card">
                          <Link className="nav-link" to={`/personaje/${personaje.slug}`}>
                            <img
                              src={personaje.imagen}
                              className="card-img-top popular-card-img"
                              alt={personaje.nombre}
                            />
                          </Link>

                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start gap-2">
                              <div style={{ minWidth: 0 }}>
                                <Link className="nav-link" to={`/personaje/${personaje.slug}`}>
                                  <h3 className="card-title popular-card-title text-truncate">
                                    {personaje.nombre}
                                  </h3>
                                </Link>

                                <Link className="nav-link" to="/categorias/:id">
                                  <p className="card-text mb-0 text-truncate">
                                    {personaje.universo}
                                  </p>
                                </Link>
                              </div>

                              <Link className="nav-link" to="/categorias/:id">
                                <span className="badge rounded-pill home-mbti-badge-small">
                                  {personaje.mbti}
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#popularCharactersCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#popularCharactersCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>

        {/* PERSONALIDADES MÁS POPULARES */}
        <div className="col-12">
          <h1 className="home-section-title2 mb-3">PERSONALIDADES POPULARES</h1>

          {personalidades.map((item, index) => (
            <div className="card personality-card" key={index}>
              <div className="card-body d-flex align-items-center gap-3">
                <div className="personality-icon-wrapper">
                  <img src={item.icono} alt={item.tipo} className="personality-icon" />
                </div>

                <div>
                  <Link className="nav-link" to="/categorias/:id">
                    <h3 className="mb-1 fw-bold tipoPersonalidad-titulo">{item.tipo}</h3>
                  </Link>
                  <p className="mb-0">{item.descripcion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default HomePage;