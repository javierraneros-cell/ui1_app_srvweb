/**
 * Cargamos el footer.html que es comun a todas las paginas
 */
document.addEventListener("DOMContentLoaded", () => {
    fetch("footer.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("contenedor-footer").innerHTML = html;
        });

    //Actualización automática cada 1 segundo y muestra de la hora:
    setInterval(actualizarHora, 1000);
});


function actualizarHora() {
    const ahora = new Date();
    const horas   = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");
    document.getElementById("contenedor-hora").textContent = `${horas}:${minutos}:${segundos}`;
}
