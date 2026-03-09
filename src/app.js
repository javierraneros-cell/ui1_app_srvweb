const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const fs = require("fs");
const ejs = require("ejs");

const app = express();

// Motor de plantillas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); //__dirname es la ruta del directorio actual (src), y "views" es la carpeta donde están las vistas EJS = /src/views

// Rutas API
const cursosRoutes = require('./routes/cursos.routes');
const profesoresRoutes = require('./routes/profesores.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const requestLogger = require('./middlewares/requestLogger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

// Middlewares
app.use(express.json());
app.use(requestLogger);
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

// Archivos estáticos
app.use(express.static(path.join(__dirname, '..', 'public')));

//Ruta check
app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

// Rutas API
app.use('/api/cursos', cursosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

/*********************************************************************************
 * 
 * Rutas para renderizar con el motor de plantillas EJS para la página de inicio
 * 
 *********************************************************************************/
//INICIO - Página de inicio lo que era antes el index.html con carrusel de imágenes y enlaces a cursos destacados
app.get("/", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "index.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");

    res.render("base-layout", {
        titulo: "Formación Global Online",
        pageId: "inicio",
        header: "index",   // <-- usa header con carrusel
        scripts: '<script src="js/index.js"></script>', // <-- script específico para la página de inicio
        body: ejs.render(contenido)
    });
});

//AVISO LEGAL - Página con el aviso legal, con el mismo layout base pero con un header específico para esta sección y sin carrusel
app.get("/aviso-legal", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "aviso-legal.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Aviso Legal - Formación Global Online",
        pageId: "aviso-legal",
        header: "aviso-legal",  
        scripts: '', // <-- script específico 
        body: ejs.render(contenido)
    });
});

//DATOS DEL ADMINISTRADOR - Página con los datos del administrador, con el mismo layout base pero con un header específico para esta sección y sin carrusel
app.get("/datos-administrador", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "datos-administrador.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Datos del Administrador - Formación Global Online",
        pageId: "datos-administrador",
        header: "datos-administrador",  
        scripts: '', // <-- script específico 
        body: ejs.render(contenido)
    });
});

//POLÍTICA DE ACCESIBILIDAD - Página con la política de accesibilidad, con el mismo layout base pero con un header específico para esta sección y sin carrusel
app.get("/politica-accesibilidad", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "politica-accesibilidad.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Política de Accesibilidad - Formación Global Online",
        pageId: "politica-accesibilidad",
        header: "politica-accesibilidad",  
        scripts: '', // <-- script específico 
        body: ejs.render(contenido)
    });
});

//LISTADO DE CURSOS - Página con listado de cursos disponibles, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script listadoCursos.js se encargará de hacer la petición a la API para obtener los cursos y mostrarlos dinámicamente en la página.
app.get("/listado-cursos", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "listado-cursos.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Listado de Cursos - Formación Global Online",
        pageId: "listado-cursos",
        header: "listado-cursos",  
        scripts: '<script src="js/listadoCursos.js"></script>', // <-- script específico listado de cursos
        body: ejs.render(contenido)
    });
});

//DETALLE DE CURSO - Página con el detalle del curso con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script detalleCurso.js se encargará de hacer la petición a la API para obtener los cursos y mostrarlos dinámicamente en la página.
app.get("/detalle-curso", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "detalle-curso.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Detalle de Curso - Formación Global Online",
        pageId: "detalle-curso",
        header: "detalle-curso",  
        scripts: '<script src="js/detalleCurso.js"></script>', // <-- script específico detalle de curso
        body: ejs.render(contenido)
    });
});

//LISTADO DE PROFESORES - Página con el listado de profesores, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script listaProfesores.js se encargará de hacer la petición a la API para obtener los profesores y mostrarlos dinámicamente en la página.
app.get("/listado-profesores", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "listado-profesores.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Listado de Profesores - Formación Global Online",
        pageId: "listado-profesores",
        header: "listado-profesores",  
        scripts: '<script src="js/listaProfesores.js"></script>', // <-- script específico listado de profesores
        body: ejs.render(contenido)
    });
});

//FORMULARIO CONTACTO - Página con el formulario de contacto, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script formularioContacto.js se encargará de hacer la petición a la API para obtener los datos y mostrarlos dinámicamente en la página.
app.get("/formulario-contacto", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "formulario-contacto.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Formulario de Contacto - Formación Global Online",
        pageId: "formulario-contacto",
        header: "formulario-contacto",  
        scripts: '<script src="js/formularioContacto.js"></script>', // <-- script específico formulario de contacto
        body: ejs.render(contenido)
    });
});

//LOGIN - Página con el formulario de contacto, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script formularioContacto.js se encargará de hacer la petición a la API para obtener los datos y mostrarlos dinámicamente en la página.
app.get("/login", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "pages", "login.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Login - Formación Global Online",
        pageId: "login",
        header: "login",  
        scripts: '<script src="js/login.js"></script>', // <-- script específico formulario de contacto
        body: ejs.render(contenido)
    });
});

//ADMINISTRACIÓN - Página con el panel de administración, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script panelAdmin.js se encargará de hacer la petición a la API para obtener los datos y mostrarlos dinámicamente en la página.
app.get("/admin", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "admin", "admin.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Panel de administracion - Formación Global Online",
        pageId: "admin",
        header: "admin",
        scripts: '<script src="/admin/js/admin.js"></script>',
        body: ejs.render(contenido)
    });
});

//ADMINISTRACIÓN - CURSOS - Página con el panel de administración, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script panelAdmin.js se encargará de hacer la petición a la API para obtener los datos y mostrarlos dinámicamente en la página.
app.get("/cursos-admin", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "admin", "cursos-admin.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Panel de administracion CURSOS - Formación Global Online",
        pageId: "cursos-admin",
        header: "cursos-admin",
        scripts: '<script src="/admin/js/cursos-admin.js"></script>',
        body: ejs.render(contenido)
    });
});

//ADMINISTRACIÓN - PROFESOSRES - Página con el panel de administración, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script panelAdmin.js se encargará de hacer la petición a la API para obtener los datos y mostrarlos dinámicamente en la página.
app.get("/profesores-admin", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "admin", "profesores-admin.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Panel de administracion PROFESOSRES - Formación Global Online",
        pageId: "profesores-admin",
        header: "profesores-admin",
        scripts: '<script src="/admin/js/profesores-admin.js"></script>',
        body: ejs.render(contenido)
    });
});

//ADMINISTRACIÓN - USUARIOS - Página con el panel de administración, con el mismo layout base pero con un header específico para esta sección y sin carrusel. El script panelAdmin.js se encargará de hacer la petición a la API para obtener los datos y mostrarlos dinámicamente en la página.
app.get("/usuarios-admin", (req, res) => {
    const rutaVista = path.join(__dirname, "views", "admin", "usuarios-admin.ejs");
    const contenido = fs.readFileSync(rutaVista, "utf8");
    res.render("base-layout", {
        titulo: "Panel de administracion USUARIOS- Formación Global Online",
        pageId: "usuarios-admin",
        header: "usuarios-admin",
        scripts: '<script src="/admin/js/usuarios-admin.js"></script>',
        body: ejs.render(contenido)
    });
});

//Al haber metido la ruta "/" al final, cualquier ruta no encontrada caerá aquí y se renderizará la página de inicio. Para evitar esto, se deben colocar las rutas específicas antes de esta ruta general.
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
