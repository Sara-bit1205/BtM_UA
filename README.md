# Behind The Mask (BtM UA)

**Behind The Mask** es una plataforma web que permite explorar personajes de ficción a través de su tipo de personalidad **MBTI**, combinando entretenimiento con análisis psicológico.

Proyecto desarrollado en el contexto de la asignatura de **Usabilidad y Accesibilidad (UA)**.

**AUTORES:** Sara Díaz Úbeda, Celia Fortea Quiles,  Nicolás Florez Pacheco y  Álvaro Millán Tobarra.

---

##  Funcionalidades principales

-  Exploración de personajes por categorías (universo, personalidad, MBTI)
-  Test de personalidad MBTI
-  Sistema de favoritos
-  Gestión de perfil de usuario
-  Subida de contenido (galería, avatar, etc.)
-  Autenticación y control de roles (usuario / admin)
-  Panel de administración:
  - Gestión de personajes
  - Gestión de categorías
  - Gestión de usuarios

---

## Arquitectura del proyecto

El proyecto sigue una arquitectura **frontend desacoplada** con acceso directo a Supabase mediante servicios.

```
BtM_UA/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Estilos e imágenes
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Vistas (public, user, admin)
│   │   ├── services/            # Acceso a datos (Supabase)
│   │   ├── context/             # Estado global (Auth)
│   │   ├── hooks/               # Hooks personalizados
│   │   ├── routes/              # Rutas de la app
│   │   ├── utils/               # Helpers
│   │   ├── lib/                 # Configuración (Supabase, Storage)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
```


---

##  Patrón de arquitectura

El proyecto utiliza una separación clara de responsabilidades:

###  `services/`
Encapsulan toda la lógica de acceso a datos:
- `characterService`
- `categoryService`
- `userService`
- `mbtiService`
- `favoritesService`

 Evita usar Supabase directamente en los componentes.

---

### `context/`
Gestión global de autenticación:
- `AuthContext`
  - sesión
  - perfil
  - rol (admin/user)
  - helpers (`logout`, `refreshProfile`)

---

###  `lib/storage.js`
Centraliza la gestión de archivos:
- `getPublicUrl`
- `getAvatarUrl`
- `uploadFile`
- `removeFiles`

Evita duplicar lógica de Storage en los componentes.

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

##  Variables de entorno

Crear un archivo `.env` en `frontend/`:

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

## Arrancar en desarrollo

```bash

# Frontend
cd frontend && npm install && npm run dev  # → http://localhost:5173
```


