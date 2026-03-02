var main = function () {

    "use strict";

    $("#btn-imprimir").on("click", function () {
        imprimirCurso();
    });

}
$(document).ready(main);


function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

async function obtenerCursoPorId(id) {
    //TODO: hacer de forma centralizada el control de errores
    const respuesta = await fetch(`/api/cursos/${id}`);
    if (!respuesta.ok){        
        const error = await respuesta.json(); 
        console.error("Error:", error.mensaje);
        return null;
    }
    const curso = await respuesta.json();
    return curso;
}

obtenerCursoPorId(obtenerIdDesdeURL()).then(curso => {
    if (!curso) {
        const contenedorResultado = document.getElementById("contenedor-respuesta-detalle-curso");
        contenedorResultado.textContent = "Curso no encontrado";
        contenedorResultado.classList.add("alert-danger");
        contenedorResultado.classList.add("alert");
        contenedorResultado.classList.remove("d-none");
    }

    // Imagen
    document.getElementById("imagen-curso").src = curso.imagen;
    document.getElementById("imagen-curso").alt = curso.titulo;

    // Título y descripción
    document.getElementById("titulo-curso").textContent = curso.titulo;
    document.getElementById("descripcion-curso").textContent = curso.descripcion;

    // Información del curso
    document.getElementById("categoria-curso").textContent = curso.categoria;
    document.getElementById("nivel-curso").textContent = curso.nivel;
    document.getElementById("duracion-curso").textContent = curso.duracion;
    document.getElementById("profesor-curso").textContent = curso.profesor;

    // Contenidos
    document.getElementById("lista-contenidos").innerHTML =
        curso.contenidos
            .map(item => `<li class="list-group-item">${item}</li>`)
            .join("");

    // Requisitos
    if (curso.requisitos.length === 0) {
        document.getElementById("lista-requisitos").innerHTML = "<li class='list-group-item'>No se requieren requisitos previos.</li>";
    } else {
        document.getElementById("lista-requisitos").innerHTML =
        curso.requisitos
            .map(item => `<li class="list-group-item">${item}</li>`)
            .join("");
    }

});

function imprimirCurso(){
    window.print();
}

