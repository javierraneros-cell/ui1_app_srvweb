# Caso Práctico – Unidad Didáctica 6 (Global Online: plataforma de cursos)

Ampliar la web realizada en la UD4 (HTML/CSS/Bootstrap/JS) para convertirla en una aplicación full-stack con Node.js + Express + MongoDB (Mongoose), usando MVC, API REST, AJAX y sesiones/cookies.

## 1) Objetivo UD6

Implementar una aplicacion web con:

- Persistencia en MongoDB.
- Backend REST con arquitectura MVC.
- Autenticacion por sesion/cookie y roles (`admin`, `alumno`).
- Frontend dinamico consumiendo API con AJAX.
- Manejo centralizado de errores.
- Validacion/sanitizacion minima en entradas de usuario.

## 2) Estado de implementacion (resumen)

### Persistencia

Colecciones implementadas:

- `cursos`: `titulo`, `categoria`, `nivel`, `duracion`, `descripcion`, `imagen`, `profesorId`, `temario`, `requisitos`, `createdAt`, `updatedAt`.
- `profesores`: `nombre`, `email`, `especialidad`, `foto`.
- `usuarios`: `nombre`, `email`, `passwordHash`, `rol`.
- `comentarios`: `usuarioId`, `cursoId`, `comentario`, `puntuacion`, `fecha`.

### Backend (MVC + REST)

Estructura principal:

- `src/models/`
- `src/controllers/`
- `src/routes/`
- `src/middlewares/`
- `public/`

### Autenticacion y roles

- Registro y login con sesion HTTP (`express-session`).
- Roles soportados: `admin` y `alumno`.
- Proteccion de rutas por middleware:
  - `requireAuth`
  - `requireRole(['admin'])`

### Frontend dinamico (UD6)

- `index.html`:
  - bloque **Nuevos cursos** cargado desde API.
  - bloque **Categorias destacadas** cargado desde API.
- `listado-cursos.html`: grid + buscador + filtros contra backend.
- `detalle-curso.html`: detalle completo del curso, profesor, comentarios y publicacion de comentario si hay sesion.
- `listado-profesores.html`: tabla de profesorado desde API.
- `admin.html`:
  - acceso unico y visibilidad por rol.
  - CRUD de cursos (admin).
  - CRUD minimo de profesores (admin).

### Seguridad / calidad

- Sanitizacion de comentarios para evitar HTML directo.
- Manejo centralizado de errores (`notFoundHandler` + `errorHandler`).
- Status codes HTTP en API.

## 3) Requisitos previos

- Node.js 18+ (recomendado 20+).
- MongoDB en local o remoto.

## 4) Configuracion y arranque

### 4.1 Variables de entorno

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Variables usadas:

- `PORT` (ejemplo: `3000`)
- `MONGODB_URI` (ejemplo: `mongodb://127.0.0.1:27017/ui1_app_srvweb`)
- `SESSION_SECRET`

### 4.2 Instalar dependencias

```bash
npm install
```

### 4.3 Poblar base de datos (seed)

```bash
npm run seed
```

### 4.4 Ejecutar aplicacion

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

URL local por defecto:

- `http://localhost:3000`

## 5) Usuarios de prueba (seed)

- `admin@globalonline.edu` / `Admin123!` (rol `admin`)
- `lucia.torres@alumnos.globalonline.edu` / `Alumno123!` (rol `alumno`)
- `miguel.santos@alumnos.globalonline.edu` / `Alumno123!` (rol `alumno`)
- `elena.martin@alumnos.globalonline.edu` / `Alumno123!` (rol `alumno`)

## 6) Endpoints principales

### Health

- `GET /health`

### Autenticacion

- `POST /api/auth/registro`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Notas:

- El registro publico crea usuarios con rol `alumno`.
- Solo un admin autenticado puede crear otro usuario con rol `admin`.

### Cursos

- `GET /api/cursos`
- `GET /api/cursos/categorias`
- `GET /api/cursos/niveles`
- `GET /api/cursos/:id`
- `POST /api/cursos` (admin)
- `PUT /api/cursos/:id` (admin)
- `DELETE /api/cursos/:id` (admin)
- `POST /api/cursos/:id/comentarios` (usuario autenticado)

### Profesores

- `GET /api/profesores`
- `GET /api/profesores/:id`
- `POST /api/profesores` (admin)
- `PUT /api/profesores/:id` (admin)
- `DELETE /api/profesores/:id` (admin)

Regla de borrado:

- No se elimina un profesor si tiene cursos asignados.

## 7) Scripts disponibles

- `npm start` -> arranca servidor (`server.js`)
- `npm run dev` -> arranque con nodemon
- `npm run seed` -> reinicia datos y carga dataset inicial

## 8) Estructura del proyecto

```text
ui1_app_srvweb/
  data/
  public/
  scripts/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
  server.js
```

## 9) Evidencias de trabajo colaborativo

Tablero GitHub Projects:

- https://github.com/users/javierraneros-cell/projects/6

## 10) Alcance y notas de entrega

- Base de datos: configurada para ejecucion local/remota mediante `MONGODB_URI`.
- Se ha priorizado cumplir los puntos obligatorios de UD6 (persistencia, MVC/REST, auth/roles, frontend dinamico y panel admin).
