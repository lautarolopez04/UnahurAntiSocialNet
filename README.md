# UnaHur Anti-Social Net - Construcción de Interfaces de Usuario

Frontend de una red social desarrollado en **React + TypeScript**. Consume una API REST para que los usuarios puedan registrarse, iniciar sesión, navegar publicaciones, comentar y crear publicaciones.

La aplicación permite:

- **Registrarse** (`POST /users`). El backend valida que el nickName no exista y el frontend muestra el mensaje de error que devuelve.
- **Iniciar sesión (simulado)** con un nickName y la contraseña fija `123456`. Se hace un `GET /users` para verificar que el usuario existe, la contraseña se valida localmente y la sesión se guarda en un contexto global (`useContext`) y en `localStorage`.
- **Ver el feed** de publicaciones recientes con descripción, imágenes, etiquetas, cantidad de comentarios y botón "Ver más". Incluye scroll infinito, botón "volver arriba" y barra lateral con tendencias.
- **Ver el detalle de una publicación** (`/post/:id`) con imágenes, etiquetas, comentarios y un formulario para comentar (`POST /comments`).
- **Ver el perfil** (ruta protegida) con las publicaciones propias y botón de cerrar sesión.
- **Crear una publicación** (ruta protegida) con descripción, una o más URLs de imágenes (`POST /postimages`) y etiquetas obtenidas de la API.

Las rutas `/perfil` y `/crear-post` solo son accesibles con un usuario logueado.

## Tecnologías utilizadas

- [React](https://react.dev/) con [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router DOM](https://reactrouter.com/)
- [React-Bootstrap](https://react-bootstrap.github.io/) y Bootstrap 5
- Context API (`useContext`) y `localStorage` para la sesión
- `fetch` para consumir la API REST

## URL de la API utilizada

```
http://localhost:3001
```

Repositorio de la API: https://github.com/lucasfigarola/backend-api

Endpoints utilizados: `/users`, `/posts`, `/posts?userId=`, `/tags`, `/comments`, `/comments/post/:postId`, `/postimages` y `/postimages/post/:postId`.

## Instrucciones para correr en local

### Requisitos

- [Node.js](https://nodejs.org/) (versión LTS recomendada) y npm
- La API corriendo en `http://localhost:3001`

### 1. Levantar el backend

```bash
git clone https://github.com/lucasfigarola/backend-api
cd backend-api
npm install
npm start
```

### 2. Levantar el frontend

```bash
git clone https://github.com/lautarolopez04/UnahurAntiSocialNet.git
cd <nombre-de-la-carpeta>
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

```

 Integrantes:

- Gomez, Florencia
- Lopez, Lautaro
- Palacios, Joaquin
- Folco, Camila Belén
