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