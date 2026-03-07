/**
 * Cargamos el footer.html que es comun a todas las paginas
 */
document.addEventListener("DOMContentLoaded", () => {
    fetch("/footer.html")
        .then(res => res.text())
        .then(html => {
            document.getElementById("contenedor-footer").innerHTML = html;
        });

    //Actualización automática cada 1 segundo y muestra de la hora:
    setInterval(actualizarHora, 1000);
});


function actualizarHora() {
    const ahora = new Date();

    const dia = String(ahora.getDate()).padStart(2, "0");
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const año = ahora.getFullYear();

    const horas   = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    const segundos = String(ahora.getSeconds()).padStart(2, "0");
    document.getElementById("contenedor-hora").textContent = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
}

//Funcion que se llama desde el inicio de la pagina cuando se carga el menu:
function cargarOpcionLogoutFooter(loginActual) {
    const contenedorLogOut = document.getElementById("footer-logout");
    const contenedorNombre = document.getElementById("footer-nombre");

    if (!contenedorLogOut) return;

    if (loginActual) {
        contenedorLogOut.innerHTML = `
            <a href="#" id="logout-link" class="text-white">Cerrar sesión</a>
        `;
        contenedorNombre.innerHTML = `
            ${loginActual.nombre}
            (${loginActual.rol}) |
        `;

        // Evento logout-link
        document.getElementById("logout-link").addEventListener("click", async (e) => {
            e.preventDefault();
            const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
            if (!res.ok){
                sessionStorage.setItem("loginMensajeFeedback", "No se pudo cerrar sesion");
                sessionStorage.setItem("loginEstadoFeedback", false);
            }else{
                sessionStorage.setItem("loginMensajeFeedback", "Sesión cerrada correctamente");
                sessionStorage.setItem("loginEstadoFeedback", true);
            }
            window.location.href = "/index.html";
        });
    } else {
        contenedorLogOut.innerHTML = "";
    }
}
