var main = function () {

    "use strict";

    $("#cabecera-orden-nombre-0").on("click", function () {
        ordenaPorColumna(this, 0);
    });

    $("#cabecera-orden-experiencia-2").on("click", function () {
        ordenaPorColumna(this, 2);
    });

    $("#cabecera-orden-numcursos-3").on("click", function () {
        ordenaPorColumna(this, 3);
    });

}
$(document).ready(main);

/**
 * Funcion que pasando la cabecera y el numero de la columna de la tabla, ordena todas las filas
 * @param {} th 
 * @param {*} columna 
 */
function ordenaPorColumna(th, columna) {

    // Toggle asc / desc
    th.dataset.order = th.dataset.order === "asc" ? "desc" : "asc";
    const orden = th.dataset.order;

    //Obtener todas las ROWS de la tabla
    const tabla = document.getElementById("tabla-profesores");
    const tbody = tabla.querySelector("tbody");
    const filas = tbody.rows;

    //Ordenar
    const filasOrdenadas = ordenarFilas(filas, orden, columna);

    // Insertar filas ordenadas
    for(i=0; i < filasOrdenadas.length; i++){
        let fila = filasOrdenadas[i];
        tbody.appendChild(fila);
    }

    // Actualizar flechas visuales
    pintaCabeceraOrden(th, orden);
}

function ordenarFilas(filasDesordendas, order, columna) {
    //Convertimos en array para poder ejecutar SORT:
    const arrayFilas = [];
    for (const fila of filasDesordendas) {
        arrayFilas.push(fila);
    }

    //Devuelve negativo si el primer elemento es menor que el segundo, 0 si son iguales o positivo si es mayor:
    arrayFilas.sort((elementoA, elementoB) => {
        const valorA = elementoA.children[columna].innerText.trim();
        const valorB = elementoB.children[columna].innerText.trim();

        const numA = parseFloat(valorA.replace(",", "."));
        const numB = parseFloat(valorB.replace(",", "."));

        // Si ambos son números
        if (!isNaN(numA) && !isNaN(numB)) {
            return order === "asc" ? numA - numB : numB - numA;
        }

        // Si son textos
        return order === "asc"
            ? valorA.localeCompare(valorB)
            : valorB.localeCompare(valorA);
    });

    return arrayFilas;
}

function pintaCabeceraOrden(th, orden) {
    // Quitar flechas de todos los th
    document.querySelectorAll("th[data-sort='true']").forEach(col => {
        col.classList.remove("asc", "desc");
    });

    // Añadir cabecera orden a la columna actual
    th.classList.add(orden);
}

