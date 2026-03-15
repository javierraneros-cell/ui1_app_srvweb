# UI1 - UD6 - Formacion Global Online

Proyecto full-stack para la UD6 de UI1 basado en Node.js + Express + MongoDB (Mongoose), reutilizando el frontend de UD4.

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
  - Permite acceder a los mantenimientos de forma individualizada de cada uno de los CRUDs.
  - acceso unico y visibilidad por rol.
  - CRUD de cursos (admin).
  - CRUD de profesores (admin).
  - CRUD de usuarios (admin).

### Seguridad / calidad

- Sanitizacion de comentarios para evitar HTML directo.
- Middleware de validacion reutilizable para `ObjectId`, campos obligatorios, email y password.
- Logs basicos de peticiones (metodo, ruta, status y tiempo).
- Manejo centralizado de errores (`notFoundHandler` + `errorHandler`).
- Respuestas de error JSON homogeneas (incluyen `ok: false`).
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
- `GET /api/cursos/:id/comentarios`
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

### Usuarios (admin)

- `GET /api/usuarios`
- `GET /api/usuarios/:id`
- `POST /api/usuarios`
- `PUT /api/usuarios/:id`
- `DELETE /api/usuarios/:id`

Notas:

- Las rutas de usuarios requieren rol `admin`.
- El API no expone `passwordHash`.
- No se permite eliminar el propio usuario en sesion.

## 7) Scripts disponibles

- `npm start` -> arranca servidor (`server.js`)
- `npm run dev` -> arranque con nodemon
- `npm run seed` -> reinicia datos y carga dataset inicial

## 8) Motor de plantillas EJS

Se ha implementado EJS como motor de plantillas, permitiendo separar y reutilizar componentes comunes (header, footer, menú) y renderizar cada página a partir de una plantilla base. Esto mejora la organización y el mantenimiento del código, permitiendo tener el cierre de sesión centralizado y mostrar el usuario conectado en caso de haber hecho un login. 


## 9) Estructura del proyecto

```text
ui1_app_srvweb/
  data/
  public/
    admin/
      js/
    css/
    imagenes/
    js/
  scripts/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    utils/
    views/
      admin/
      pages/
      partials/
    app.js
  server.js
```

## 10) Evidencias de trabajo colaborativo

Tablero GitHub Projects:

- https://github.com/users/javierraneros-cell/projects/6

## 11) Alcance y notas de entrega

- Base de datos: configurada para ejecucion local/remota mediante `MONGODB_URI`.
- Se ha priorizado cumplir los puntos obligatorios de UD6 (persistencia, MVC/REST, auth/roles, frontend dinamico y panel admin).
- El detalle de curso devuelve profesor y comentarios; adicionalmente existe endpoint especifico para comentarios por curso.
- Las tareas opcionales no imprescindibles se dejan para ampliaciones posteriores.

## 12) Despligues rama Main en AWS

### Rama final main en AWS

Además del despliegue realizado en Vercel de una rama intermedia del desarrollo, se ha desplegado en AWS el proyecto final la rama main. Finalmente se ha optado por desplegar en un EC2 descartando la intención inicial de usar Elastic BeanStalk. 

Se encuentra publicado en:
- DNS público AWS con dirección abierta: https://ec2-3-229-106-113.compute-1.amazonaws.com/
- Con resolución privada: https://ui1-grupo4-app.duckdns.org
- Se ha optado por usar MongoDB Atlas en cloud 

### Despliegue rama previa en Vercel 

Se puede acceder a la página en línea donde se desplegó una rama previa del proyecto

- https://ui1appsrvweb.vercel.app
