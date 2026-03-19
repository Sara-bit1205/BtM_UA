// Página principal — accesible sin autenticación
// Punto de entrada: muestra bienvenida, accesos a Menú Lateral y búsqueda

import { Link } from 'react-router-dom';
import React from 'react';
import '../../assets/styles/home.css';

//--------------------
import captainAmericaImg from '../../assets/images/captainAmerica.jpg';
import maleficaImg from '../../assets/images/malefica.jpg';
import spidermanImg from '../../assets/images/spiderman.jpg';
import elsaImg from '../../assets/images/elsa.png';
import batmanImg from '../../assets/images/batman.jpg';

import arquitectoIcono from '../../assets/images/bricks.svg';
//---------------------

const personajeDelDia = {
  nombre: "Capitán América",
  universo: "Marvel",
  mbti: "ISFJ",
  imagen: captainAmericaImg,
}

const personajesPopulares = [
  {
    nombre: "MALÉFICA",
    universo: "Universo Disney",
    mbti: "INTJ",
    imagen: maleficaImg,
  },
  {
    nombre: "SPIDERMAN",
    universo: "Universo Marvel",
    mbti: "INTJ",
    imagen: spidermanImg,
  },
  {
    nombre: "BATMAN",
    universo: "Universo DC",
    mbti: "INTJ",
    imagen: batmanImg,
  },
  {
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

function agruparDe2En2(items) {
  const grupos = [];
  for(let i = 0; i < items.length; i += 2){
    //Se usa items.slice --> para tomar un subarray de 2 elementos a partir del índice i
    grupos.push(items.slice(i, i + 2));
  }
  return grupos;
}

function HomePage() {
  const gruposPersonajes = agruparDe2En2(personajesPopulares);
  return (
    <main className="container py-4 home-page">
      <div className="row g-5">
        {/* PERSONAJE DEL DÍA */}
        <div className="col-12">
          <h1 className="home-section-title mb-3 text-center">PERSONAJE DEL DÍA</h1>

          <div className="card text-bg-dark card-personaje-del-dia">
            <Link className="nav-link" to="/personaje/:id">
              <img src={personajeDelDia.imagen} className="card-img card-personaje-del-dia-img" alt={personajeDelDia.nombre}/>
            </Link>
            <div className="card-img-overlay d-flex flex-column justify-content-end personaje-del-dia-overlay">
              <div className="d-flex justify-content-between align-items-end">
                <div>
                  <Link className="nav-link" to="/personaje/:id">
                  <h3 className="card-title mb-1 text-uppercase fw-bold nombre-del-dia">
                    {personajeDelDia.nombre}
                  </h3>
                  </Link>
                  <Link className="nav-link" to="/categorias/:id">
                  <p className="card-text mb-0">
                    Universo {personajeDelDia.universo}
                  </p>
                  </Link>
                </div>
                
                <Link className="nav-link" to="/categorias/:id">
                {/* Badge --> forma personalizada de Bootstrap, para hacer la etiqueta MBTI */}
                  <span className="badge rounded-pill home-mbti-badge mr-2">
                    {personajeDelDia.mbti}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONAJES MÁS POPULARES */}
        <div className="col-12">
        
          <div id="popularCharactersCarousel" className="carousel slide popular-carousel" data-bs-ride="carousel" >
            <h1 className="home-section-title mb-3 text-center">PERSONAJES POPULARES</h1>
            <div className="carousel-inner">
              {gruposPersonajes.map((grupo, index) => (
                <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`} >
                  <div className="row g-3">
                    {grupo.map((personaje, idx) => (
                      <div className="col-6 " key={idx}>
                        <div className="card popular-card"> 
                          <Link className="nav-link" to="/personaje/:id">
                            <img src={personaje.imagen} className="card-img-top popular-card-img" alt={personaje.nombre}/>
                          </Link>
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div style={{ minWidth: 0 }}> {/* El minWidth evita que el texto desborde el flex */}
                                <Link className="nav-link" to="/personaje/:id">
                                <h3 className="card-title popular-card-title text-truncate">
                                  {personaje.nombre}
                                </h3>
                                </Link>
                                <Link className="nav-link" to="/categorias/:id">
                                <p className="card-text mb-0 x-small text-truncate">
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

            <button className="carousel-control-prev"  type="button"  data-bs-target="#popularCharactersCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>

            <button className="carousel-control-next"  type="button"  data-bs-target="#popularCharactersCarousel"  data-bs-slide="next">
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
                  <img src={item.icono}  alt={item.tipo}  className="personality-icon"/>
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