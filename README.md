# Behind The Mask (BtM UA)

Plataforma web para explorar personajes de ficción según su tipo de personalidad MBTI.
Proyecto de Usabilidad y Accesibilidad.

## Estructura del proyecto

```
BtM_UA/
├── frontend/                          # React + Vite
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/styles/global.css
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── SideMenu.jsx
│   │   │   │   ├── SearchBar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── characters/
│   │   │   │   ├── CharacterCard.jsx
│   │   │   │   └── CharacterList.jsx
│   │   │   ├── categories/
│   │   │   │   └── CategoryCard.jsx
│   │   │   └── mbti/
│   │   │       ├── MBTIQuestion.jsx
│   │   │       └── MBTIResult.jsx
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   ├── AboutBTMPage.jsx
│   │   │   │   ├── PersonalityTestPage.jsx
│   │   │   │   ├── CategoriesPage.jsx
│   │   │   │   ├── CategoryDetailPage.jsx
│   │   │   │   ├── CharacterDetailPage.jsx
│   │   │   │   ├── SearchPage.jsx
│   │   │   │   ├── AboutUsPage.jsx
│   │   │   │   └── PrivacyPolicyPage.jsx
│   │   │   ├── user/
│   │   │   │   ├── UserProfilePage.jsx
│   │   │   │   ├── FavoritesPage.jsx
│   │   │   │   ├── EditUserPage.jsx
│   │   │   │   └── MyMBTIPage.jsx
│   │   │   └── admin/
│   │   │       ├── AdminProfilePage.jsx
│   │   │       ├── CharactersAdminPage.jsx
│   │   │       ├── CategoriesAdminPage.jsx
│   │   │       └── UsersListPage.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── characterService.js
│   │   │   ├── categoryService.js
│   │   │   ├── userService.js
│   │   │   ├── mbtiService.js
│   │   │   └── searchService.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   └── useMBTI.js
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
└── backend/                           # Node.js + Express + MongoDB
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── characterController.js
    │   │   ├── categoryController.js
    │   │   ├── userController.js
    │   │   ├── mbtiController.js
    │   │   └── searchController.js
    │   ├── models/
    │   │   ├── User.js
    │   │   ├── Character.js
    │   │   ├── Category.js
    │   │   └── MBTIResult.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── characterRoutes.js
    │   │   ├── categoryRoutes.js
    │   │   ├── userRoutes.js
    │   │   ├── mbtiRoutes.js
    │   │   └── searchRoutes.js
    │   ├── middleware/
    │   │   ├── authMiddleware.js
    │   │   └── roleMiddleware.js
    │   ├── services/
    │   │   ├── emailService.js
    │   │   └── mbtiService.js
    │   ├── utils/
    │   │   └── helpers.js
    │   └── app.js
    ├── .env
    ├── .gitignore
    ├── package.json
    └── server.js
```

## Arrancar en desarrollo

```bash
# Backend
cd backend && npm install && npm run dev   # → http://localhost:3000

# Frontend
cd frontend && npm install && npm run dev  # → http://localhost:5173
```

## Stack tecnológico

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| Frontend      | React 18, Vite, React Router v6     |
| Backend       | Node.js, Express 4                  |
| Base de datos | MongoDB + Mongoose                  |
| Auth          | JWT + bcryptjs                      |
| Email         | Nodemailer (doble verificación)     |
