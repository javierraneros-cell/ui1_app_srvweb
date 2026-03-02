var main = function () {

    "use strict";

    $("#boton-limpiar-filtros").on("click", function () {
        limpiarFiltros();
    });

    $("#filtro-titulo").on("input", function () {
        cargarCursos(document.getElementById('filtro-titulo').value, 
                     document.getElementById('filtro-categoria').value);
    });

     $("#filtro-categoria").on("change", function () {
        cargarCursos(document.getElementById('filtro-titulo').value, 
                     document.getElementById('filtro-categoria').value);
    });    
}
$(document).ready(main);


window.addEventListener("load", () => {
        cargarCursos(document.getElementById('filtro-titulo').value, 
                    document.getElementById('filtro-categoria').value);
});

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) cargarCursos( document.getElementById('filtro-titulo').value, 
                                        document.getElementById('filtro-categoria').value);
});


function cargarCursos(tituloFiltro = "", categoriaFiltro = "") {
    fetch(`/api/cursos?titulo=${tituloFiltro}&categoria=${categoriaFiltro}`)
        .then(response => response.json())
        .then(listadoCursos => {

            const contenedor = document.getElementById("contenedor-cursos");

            //Antes de pintar lo vacimos
            contenedor.innerHTML = "";

            // Pinta CARDs
            listadoCursos.forEach(curso => {
                const card = `
                    <div class="col-12 col-md-6 col-lg-4">
                        <div class="card h-100 shadow-sm d-flex flex-column">
                            <img src="${curso.imagen}" class="card-img-top" alt="${curso.titulo}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${curso.titulo}</h5>
                                <ul class="lista-generica">
                                    <li><strong>Categoría: </strong>${curso.categoria}</li>
                                    <li><strong>Nivel: </strong>${curso.nivel}</li>
                                </ul>
                                <a href="${curso.detalle}?id=${curso.id}" class="btn btn-outline-primary w-100 mt-auto">
                                    Ver detalles
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                contenedor.innerHTML += card;
            });
            const resultadoContenedor = document.getElementById("contenedor-resultado-cursos");
            resultadoContenedor.style.display = "block";
            resultadoContenedor.innerHTML = ""; // Limpiamos mensaje previo
            if (listadoCursos.length === 0) {  
                resultadoContenedor.innerHTML = "<p class='text-center'>No se han encontrado cursos que coincidan con los filtros aplicados.</p>";
            }else {
                resultadoContenedor.innerHTML = "<p class='text-center'>Se han encontrado " + listadoCursos.length + " curso(s).</p>" + resultadoContenedor.innerHTML;
            }
        })
        .catch(error => console.error("Error cargando cursos:", error));
}

function limpiarFiltros() {
    document.getElementById("filtro-titulo").value = "";
    document.getElementById("filtro-categoria").value = "";

    //Ejecutamos de nuevo la recarga de cursos sin filtros
    cargarCursos();
}

