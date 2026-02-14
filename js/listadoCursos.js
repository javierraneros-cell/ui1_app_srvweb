function cargarCursos(tituloFiltro = "", categoriaFiltro = "") {
    fetch("data/cursos.json")
        .then(response => response.json())
        .then(listadoCursos => {

            const contenedor = document.getElementById("contenedor-cursos");

            //Antes de pintar, limpiamos el contenedor
            contenedor.innerHTML = "";

            // Normalizamos filtros
            const tituloBuscar = tituloFiltro.toLowerCase().trim();
            const categoriaBuscar = categoriaFiltro.trim();

            // Filtramos cursos CATEGORIA exacta, TITULO parcial (si se introduce texto)
            const cursosFiltrados = listadoCursos.filter(curso => {
                const coincideTitulo = curso.titulo.toLowerCase().includes(tituloBuscar);

                // Si no se selecciona categoría → no filtra por categoría
                const coincideCategoria = categoriaBuscar === "" 
                    ? true 
                    : curso.categoria === categoriaBuscar;

                return coincideTitulo && coincideCategoria;
            });

            // Pinta CARDs
            cursosFiltrados.forEach(curso => {
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
            if (cursosFiltrados.length === 0) {  
                resultadoContenedor.innerHTML = "<p class='text-center'>No se han encontrado cursos que coincidan con los filtros aplicados.</p>";
            }else {
                resultadoContenedor.innerHTML = "<p class='text-center'>Se han encontrado " + cursosFiltrados.length + " curso(s).</p>" + resultadoContenedor.innerHTML;
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

