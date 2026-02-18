/**
 * Este funcion se encarga de leer los cursos del fichero JSON y crear dinamicamente el menu del listado de cursos
 */
function cargarCursosEnMenu() {
    fetch("data/cursos.json")
        .then(response => response.json())
        .then(listadoCursos => {
            const lista = document.getElementById("listaCursos");

            listadoCursos.forEach(curso => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a class="dropdown-item" href="${curso.detalle}?id=${curso.id}">
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
            //setTimeout(() => { cargarCursosEnMenu(); }, 0)
        });
});


