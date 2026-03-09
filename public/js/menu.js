/**
 *  Funcion que lee los cursos desde la base de datos y crear dinamicamente el menu del listado de cursos
 */
function cargarCursosEnMenu() {
    fetch("/api/cursos")
        .then(response => response.json())
        .then(listadoCursos => {
            const lista = document.getElementById("listaCursos");

            listadoCursos.forEach(curso => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a class="dropdown-item" href="detalle-curso?id=${curso._id}">
                        ${curso.titulo}
                    </a>
                `;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error("Error cargando cursos:", err));
}

function cargarOpcionMenuAdministracion(loginActual){
    const ilMenuAdmin = document.getElementById("menuAdmin");
    var anclajeAdmin;
    if (loginActual && loginActual.rol == 'admin'){
        anclajeAdmin = `
            <div class="btn-group">
                <a class="nav-link" href="/admin">Administración</a>
                <button class="nav-link dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="/cursos-admin">Cursos</a></li>
                    <li><a class="dropdown-item" href="/profesores-admin">Profesores</a></li>
                    <li><a class="dropdown-item" href="/usuarios-admin">Usuarios</a></li>
                </ul>
            </div>
            `;
    }else if(!loginActual){
        anclajeAdmin = `<a class="nav-link" href="login">Acceder</a>`;
    }else{
        anclajeAdmin = "";
    }
    ilMenuAdmin.innerHTML = anclajeAdmin;
}

/**
 * Cargamos los cursos del menu entre otras cosas que es comun a todas las paginas
 */
document.addEventListener("DOMContentLoaded", async() => {
    cargarCursosEnMenu();

    //Comprobamos la sesión para mostrar o no el menú de Administración:
    const loginActual = await obtenerUsuarioActual();
    cargarOpcionMenuAdministracion(loginActual);
    cargarOpcionUsuarioLogout(loginActual);
});

//Obtener usuario y rol:
async function obtenerUsuarioActual() {
    try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return null;

        const data = await res.json();
        return data.usuario;
    } catch (err) {
        return null;
    }
}

function aumentarTexto() {
    const contenido = getContenido();
    let tActual = getTamanoMain(contenido);
    tActual += 10; // +10%
    contenido.style.fontSize = tActual + "%";
}

function disminuirTexto() {
    const contenido = getContenido();
    let tActual = getTamanoMain(contenido);
    if (tActual > 50) {
        tActual -= 10; // -10%
    }
    contenido.style.fontSize = tActual + "%";
}

function getContenido() {
    return document.querySelector("main");
}

function getTamanoMain(contenido) {
    return parseInt(contenido.style.fontSize) || 100;
}

