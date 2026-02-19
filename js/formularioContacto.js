function validaCampo(idCampo, minimoCaracteres) {
    const campoValor = document.getElementById(idCampo);

    if (minimoCaracteres > 0) {
        if ( campoValor.value.trim().length < minimoCaracteres ){
            estableceValidez(campoValor, false);
        }else{
            estableceValidez(campoValor, true);
            return true;
        }
    }else{
        if (campoValor.value.trim() === "") {
            estableceValidez(campoValor, false);
        } else {
            estableceValidez(campoValor, true);
            return true;
        }
    }
}

function validaCorreo() {
    const correo = document.getElementById("correo");
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value);
    if (!correoValido) {
        estableceValidez(correo, false);
    } else {
        estableceValidez(correo, true);
        return true;
    }
}

function estableceValidez(campo, esValido ){
    if(esValido){
        campo.classList.add("is-valid");
        campo.classList.remove("is-invalid");
    }else{
        campo.classList.add("is-invalid");
        campo.classList.remove("is-valid");    
    }
    resetResultadoFormulario();
}

function cuentaCaracteresMensaje(minimoCaracteres){
    const campoValor = document.getElementById("mensaje");
    document.getElementById("conteo-mensaje").textContent = campoValor.value.trim().length;

    //Si va por debajo del minimo alertamos, si pasa lo eliminamos:
    if ( campoValor.value.trim().length < minimoCaracteres){
        document.getElementById("contenedor-conteo-mensaje").classList.add("alert");
    }else{
        document.getElementById("contenedor-conteo-mensaje").classList.remove("alert");
    }
}

function enviarFormulario(){
    const resultadoMensaje = validaCampo('mensaje', 30);
    const resultadoNombre = validaCampo('nombre', 0);
    const resultadoCorreo = validaCorreo();
    const resultadoTematica = validaCampo('tematica', 0);

    const contenedorResultado = document.getElementById("contenedor-respuesta-formulario");
    if (resultadoMensaje && resultadoNombre && resultadoCorreo && resultadoTematica){
        contenedorResultado.textContent = "Formulario enviado correctamente!!";
        contenedorResultado.classList.add("alert-success");
        contenedorResultado.classList.add("alert");
        contenedorResultado.classList.remove("d-none");
        return true;
    }else{
        contenedorResultado.textContent = "Formulario no enviado, revise los errores";
        contenedorResultado.classList.add("alert-danger");
        contenedorResultado.classList.add("alert");
        contenedorResultado.classList.remove("d-none");
        return false;
    }
}

function resetResultadoFormulario(){
    const contenedorResultado = document.getElementById("contenedor-respuesta-formulario");
    contenedorResultado.textContent = "";
    contenedorResultado.classList.remove("alert-success");
    contenedorResultado.classList.remove("alert-danger");
    contenedorResultado.classList.remove("alert");
    contenedorResultado.classList.add("d-none"); 
}