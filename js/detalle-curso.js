function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"));
}

async function obtenerCursoPorId(id) {
    try {
        const respuesta = await fetch("data/cursos.json");
        const cursos = await respuesta.json();

        const curso = cursos.find(curso => curso.id === id);

        return curso || null;
    } catch (error) {
        console.error("Error cargando JSON:", error);
        return null;
    }
}

obtenerCursoPorId(obtenerIdDesdeURL()).then(curso => {

    if (!curso) {
        document.body.innerHTML = "<p>Curso no encontrado.</p>";
        return;
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

