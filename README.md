# Behind The Mask (BtM UA)

**Behind The Mask** es una plataforma web centrada en el análisis de personajes de ficción mediante el sistema de personalidad MBTI.

La aplicación permite explorar personajes, descubrir compatibilidades psicológicas, realizar tests MBTI y compartir contenido multimedia relacionado con universos de ficción.

Proyecto desarrollado en el contexto de la asignatura de **Usabilidad y Accesibilidad (UA)**.

---

## Funcionalidades principales

### Exploración de contenido
- Exploración de personajes por universos
- Clasificación MBTI
- Sistema de búsqueda avanzada
- Filtros dinámicos

### Sistema de usuario
- Registro e inicio de sesión
- Gestión de perfil
- Sistema de favoritos
- Avatares personalizados

### Experiencia interactiva
- Test MBTI integrado
- Compatibilidad con personajes
- Galería multimedia
- Descarga de contenido

### Administración
- CRUD de personajes
- CRUD de categorías
- Gestión de usuarios
- Control de roles

---

## Arquitectura del proyecto

El proyecto sigue una arquitectura **frontend desacoplada** con acceso directo a Supabase mediante servicios.

```
BtM_UA/
├── frontend/
│   ├── src/
│   │   ├── assets/       # Estilos e imágenes para pruebas 
│   │   │
│   │   ├── components/
│   │   │   ├── common/   # Componentes reutilizables
│   │   │      ├── Footer.jsx
│   │   │      ├── Navbar.jsx
│   │   │      ├── ProtectedRoute.jsx
│   │   │      └── StylePanel.jsx
│   │   │   
│   │   ├── context/
│   │   │      ├── AuthContext.jsx
│   │   │      └── ThemeContext.jsx
│   │   │   
│   │   ├── layouts/
│   │   │      └── mainLayout.jsx
│   │   │   
│   │   ├── lib/
│   │   │   ├── storage.js
│   │   │   └── supabase.js
│   │   │
│   │   ├── pages/        # Vistas (public, user, admin)
│   │   │   ├── admin/
│   │   │   │   ├── AdminProfilePage.jsx
│   │   │   │   ├── CategoriesAdminPage.jsx
│   │   │   │   ├── CharacterAdminPage.jsx
│   │   │   │   ├── EliminarPersonaje.jsx
│   │   │   │   ├── FormularioPersonaje.jsx
│   │   │   │   ├── ListaPersonaje.jsx
│   │   │   │   └── UserListPage.jsx
│   │   │   │
│   │   │   ├── public/
│   │   │   │   ├── AboutMBTIPage.jsx
│   │   │   │   ├── AboutUsPage.jsx
│   │   │   │   ├── CategoriesPage.jsx
│   │   │   │   ├── CharacterDetailPage.jsx
│   │   │   │   ├── Clasificador.jsx
│   │   │   │   ├── DownloadsPage.jsx
│   │   │   │   ├── GaleriaUsuario.jsx
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── HowMBTIWorksPage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── MBTITypesPage.jsx
│   │   │   │   ├── PersonalityTestPage.jsx
│   │   │   │   ├── PrivacyPolicyPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── SearchPage.jsx
│   │   │   │
│   │   │   └── user/
│   │   │       ├── EditUserPage.jsx
│   │   │       ├── FavoritePage.jsx
│   │   │       ├── MyMBTIPage.jsx
│   │   │       └── UserProfilePage.jsx
│   │   │
│   │   ├── services/       # Acceso a datos (Supabase)
│   │   │   ├── authService.js
│   │   │   ├── categoryService.js
│   │   │   ├── characterService.js
│   │   │   ├── favoriteService.js
│   │   │   ├── mbtiService.js
│   │   │   ├── mbtiTypeService.js
│   │   │   ├── searchService.js
│   │   │   └── userService.js
│   │   │
│   │   ├── routes/          # Rutas de la app
│   │   │   └── AppRoutes.jsx
│   │   │
│   │   ├── utils/           # Helpers
│   │   │   └── relation.js
│   │   │
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── index.html
├── netlify.toml
└── README.md

```

---

## Arquitectura

Behind The Mask sigue una arquitectura SPA (Single Page Application) basada en React + Vite.

La aplicación interactúa directamente con Supabase como backend-as-a-service, utilizando:
- PostgreSQL para persistencia de datos
- Supabase Auth para autenticación
- Supabase Storage para archivos multimedia
- Policies RLS para seguridad y permisos

El acceso a datos se abstrae mediante una capa de servicios, evitando el acceso directo desde los componentes React y mejorando la mantenibilidad del proyecto.

---

##  Stack tecnológico

| Capa            | Tecnología                          |
|-----------------|-------------------------------------|
| Frontend        | React 18 + Vite                     |
| Routing         | React Router v6                     |
| Backend (BaaS)  | Supabase                            |
| Base de datos   | PostgreSQL (Supabase)               |
| Auth            | Supabase Auth                       |
| Storage         | Supabase Storage                    |
| Estilos         | CSS + Bootstrap                     |

---

## Badges

![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-Frontend-purple)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Netlify](https://img.shields.io/badge/Deploy-Netlify-black)
![License](https://img.shields.io/badge/license-Academic-lightgrey)

---

## Instalación y ejecución

### Ejecutando desde terminal
```bash
cd frontend && npm install && npm run dev  # → http://localhost:5173
```
### Despliegue en Netlify 

```bash
https://ua-behind-the-mask.netlify.app/
```
---

## Autores
  - Sara Díaz Úbeda
  - Celia Fortea Quiles
  - Nicolás Florez Pacheco
  - Álvaro Millán Tobarra.

---

## Licencia

Proyecto académico desarrollado con fines educativos.

