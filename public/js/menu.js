/**
 *  Funcion que lee los cursos del fichero JSON y crear dinamicamente el menu del listado de cursos
 */
function cargarCursosEnMenu() {
    fetch("api/cursos")
        .then(response => response.json())
        .then(listadoCursos => {
            const lista = document.getElementById("listaCursos");

            listadoCursos.forEach(curso => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a class="dropdown-item" href="detalle-curso.html?id=${curso._id}">
                        ${curso.titulo}
                    </a>
                `;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error("Error cargando cursos:", err));
}

/**
 * Cargamos el menu.html que es comun a todas las paginas
 */
document.addEventListener("DOMContentLoaded", () => {
    fetch("menu.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("contenedor-menu").innerHTML = html;
            cargarCursosEnMenu();
        });
});


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

