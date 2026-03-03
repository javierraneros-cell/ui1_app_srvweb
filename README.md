# Contexto
La empresa Formación Global Online desea desarrollar una plataforma web dedicada a la oferta de cursos de formación en línea en distintas áreas del conocimiento (tecnología, diseño, empresa, idiomas, etc.). El objetivo del proyecto es crear un prototipo inicial del sitio web que sirva como base para futuras ampliaciones, en las que se incorporarán diseño visual avanzado, interactividad y funcionalidades dinámicas.
Este proyecto se desarrollará de forma progresiva a lo largo de la asignatura. En esta primera unidad didáctica se abordará exclusivamente la estructura HTML, que será mejorada en unidades posteriores mediante CSS, Bootstrap y JavaScript.

## Objetivo de la actividad
Desarrollar el código HTML de un sitio web estático que represente una plataforma de cursos en línea, utilizando una estructura correcta, completa y semántica.

En esta entrega no se debe utilizar CSS, JavaScript ni ningún otro tipo de diseño o programación adicional. El objetivo es evaluar la correcta estructuración del contenido, el uso de etiquetas HTML y el cumplimiento de las buenas prácticas vistas en la unidad didáctica.

## UD2 Unidad didáctica 2. Estilos con CSS
Añadido estilos CSS para maquetar el HTML actual pedido en la actividad y pasado el validador CSS https://jigsaw.w3.org/css-validator y de HTML https://validator.w3.org. También se comprueba que es responive

## UD4 Unidad didáctica 4. JSS y Bootstrap 

Continuaremos con la web creada en las unidades anteriores para la plataforma Formación Global Online, pero ahora reorganizándola completamente con Bootstrap y añadiendo interactividad con JavaScript/jQuery.

En esta entrega se evaluará especialmente el uso de Bootstrap (grid, componentes y responsive) y la programación en JavaScript/jQuery (DOM, eventos, validación, arrays y asincronía

Los cambios más importantes son:
- Carousel Bootstrap en la parte superior en la pagina inicial
- Añadidos a la página index bloques informativos tipo “blog” (noticias/actualizaciones de la plataforma) maquetados con Boostrap
- El listado de cursos cargados a través de un fichero JSON y mostrados en formato CARDS con una busqueda como filtro
- Tabla de listado de profesores con estilo bootstrap y ordenable
- Menu bootstrap y generado dinamicamente
- Footer con la hora de forma dinamica y paginas de adminsitrador, contenido legal y accesiblidad
- Formulario de contacto

Pasadas validaciones de https://validator.w3.org y https://jigsaw.w3.org/css-validator

## UD6 Bloque 1. Persistencia de datos (MongoDB + Mongoose)

Se ha añadido una base de backend con Node.js + Express + Mongoose para cubrir la persistencia del proyecto.

Colecciones implementadas:
- `cursos`: `titulo`, `categoria`, `nivel`, `duracion`, `descripcion`, `imagen`, `profesorId`, `temario`, `createdAt`, `updatedAt`.
- `profesores`: `nombre`, `email`, `especialidad`, `foto`.
- `usuarios`: `nombre`, `email`, `passwordHash`, `rol`.
- `comentarios`: `usuarioId`, `cursoId`, `comentario`, `puntuacion`, `fecha`.

Estructura añadida:
- `src/config/database.js` conexión de MongoDB.
- `src/models/` con los 4 modelos Mongoose.
- `src/server.js` y `src/app.js` para arranque básico.
- `scripts/seed.js` para poblar cursos y profesores desde `data/cursos.json`.

### Puesta en marcha

1. Copiar variables de entorno:
```bash
cp .env.example .env
```

2. Instalar dependencias:
```bash
npm install
```

3. Lanzar backend:
```bash
npm run dev
```

4. Poblar base de datos:
```bash
npm run seed
```

## UD6 Bloque 2. Backend (Node.js + Express) y API REST

Se ha continuado la rama `ud6_node_mongodb` con una estructura MVC y API REST funcional:

- `src/controllers/`:
  - `cursos.controller.js`: listado con filtros, detalle con profesor y comentarios, categorías y niveles.
  - `profesores.controller.js`: listado y detalle de profesorado con número de cursos.
- `src/routes/`:
  - `cursos.routes.js`
  - `profesores.routes.js`
- `src/middlewares/`:
  - `asyncHandler.js` para errores en controladores async.
  - `errorHandler.js` para manejo centralizado de errores y 404.

### Endpoints disponibles

- `GET /health`
- `GET /api/cursos`
- `GET /api/cursos/:id`
- `GET /api/cursos/categorias`
- `GET /api/cursos/niveles`
- `GET /api/profesores`
- `GET /api/profesores/:id`

También se adaptó el frontend para consumir backend real en:
- `public/listado-profesores.html` + `public/js/listaProfesores.js`
- `public/detalle-curso.html` + `public/js/detalle-curso.js`

## UD6 Bloque 3. Autenticación, cookies y sesiones

Se añadió autenticación basada en sesión con cookie HTTP:

- Dependencias: `express-session` y `bcryptjs`.
- Cookie de sesión: `sid` (`httpOnly`, `sameSite=lax`).
- Control de acceso por rol con middleware:
  - `requireAuth`
  - `requireRole(['admin'])`

### Endpoints de autenticación

- `POST /api/auth/registro`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

`/api/auth/registro` crea usuarios con rol `alumno` por defecto. Solo un admin autenticado puede crear otro usuario con rol `admin`.

### Endpoints protegidos por rol admin

- `POST /api/cursos`
- `PUT /api/cursos/:id`
- `DELETE /api/cursos/:id`

### Usuarios de prueba cargados por seed

Tras ejecutar `npm run seed`:

- `admin@globalonline.edu` / `Admin123!` (rol `admin`)
- `lucia.torres@alumnos.globalonline.edu` / `Alumno123!` (rol `alumno`)
- `miguel.santos@alumnos.globalonline.edu` / `Alumno123!` (rol `alumno`)
- `elena.martin@alumnos.globalonline.edu` / `Alumno123!` (rol `alumno`)
