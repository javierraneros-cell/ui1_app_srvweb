let adminSesion = null;

function setFeedback(mensaje, ok) {
  const box = document.getElementById('admin-feedback');
  box.className = 'mb-3 alert';
  box.classList.add(ok ? 'alert-success' : 'alert-danger');
  box.textContent = mensaje;
}

async function setFeedbackFromStorageSesion() {
    const mensaje = sessionStorage.getItem("loginMensajeFeedback");
    const estado = sessionStorage.getItem("loginEstadoFeedback") === "true";

    if (mensaje) {
        setFeedback(mensaje, estado);
        // Limpiar para que no vuelva a aparecer al refrescar
        sessionStorage.removeItem("loginMensajeFeedback");
        sessionStorage.removeItem("loginEstadoFeedback");
    }
}

async function comprobarSesion() {
  try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });

      if (!res.ok) {
        adminSesion = null;
        toggleAdminUI(false);
        const error = await res.json();
        setFeedback(error.mensaje || 'error.', false);
        return;
      }

      const data = await res.json();
      adminSesion = data.usuario;
      const esAdmin = adminSesion.rol === 'admin';
      toggleAdminUI(esAdmin);

      if (!esAdmin) {
        setFeedback('Tu sesion esta iniciada, pero no tienes permisos de administracion.', false);
        return;
      }
  } catch (error) {
    console.error('Error comprobando sesion:', error);
    adminSesion = null;
    toggleAdminUI(false);
  }
}

function toggleAdminUI(isAdmin) {
  document.getElementById('container-admin').style.display = isAdmin ? 'row g-4 py-5 row-cols-1 row-cols-lg-3' : 'none';

  const info = document.getElementById('admin-user-info');
  if (!adminSesion) {
    info.textContent = '';
    return;
  }

  info.textContent = `${adminSesion.nombre} (${adminSesion.email}) - Rol: ${adminSesion.rol}`;
}

document.addEventListener('DOMContentLoaded', async () => {

  await setFeedbackFromStorageSesion();
  await comprobarSesion();

});
