/** Este código JavaScript se encarga de manejar la funcionalidad de los botones "Leer más" en las tarjetas de contenido. 
 * Al hacer clic en el botón, se alterna la visibilidad del texto corto y largo, y se cambia el texto del botón entre "Leer más" y "Leer menos". 
 * Esto permite a los usuarios expandir o contraer la información según su preferencia.
 * 
 * Archivo: index.js
*/
$(document).ready(function () {
    $(".btn-toggle").on("click", function () {
        const card = $(this).closest(".card");

        const corto = card.find(".card-corto"); 
        const largo = card.find(".card-largo");

        // Alternar visibilidad, solo está visible uno de los dos con TOGGLE:
        corto.toggle();
        largo.toggle();

        // Cambiar texto botón
        if ($(this).text() === "Leer más") {
            $(this).text("Leer menos");
        } else {
            $(this).text("Leer más");
        }
    });
});

/**
 * Este funcion se encarga de leer los cursos del fichero JSON y crear dinamicamente el menu del listado de cursos
 */
document.addEventListener("DOMContentLoaded", cargarCursosEnMenu);

function cargarCursosEnMenu() {
    fetch("data/cursos.json")
        .then(response => response.json())
        .then(listadoCursos => {
            const lista = document.getElementById("listaCursos");

            listadoCursos.forEach(curso => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <a class="dropdown-item" href="detalle-curso.html?id=${curso.id}">
                        ${curso.titulo}
                    </a>
                `;
                lista.appendChild(li);
            });
        })
        .catch(err => console.error("Error cargando cursos:", err));
}
