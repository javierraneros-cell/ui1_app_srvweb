let adminSesion = null;
let profesores = [];
let cursos = [];
let usuarios = [];

function setFeedback(mensaje, ok) {
  const box = document.getElementById('sesion-feedback');
  box.className = 'mb-3 alert';
  box.classList.add(ok ? 'alert-success' : 'alert-danger');
  box.textContent = mensaje;
}

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function validarPayloadCurso(payload) {
  const obligatorios = ['titulo', 'categoria', 'nivel', 'duracion', 'imagen', 'descripcion', 'profesorId'];
  for (const campo of obligatorios) {
    if (!String(payload[campo] || '').trim()) {
      return `El campo ${campo} es obligatorio.`;
    }
  }
  return null;
}

async function comprobarSesion() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });

  if (!res.ok) {
    adminSesion = null;
    return;
  }

  const data = await res.json();
  adminSesion = data.usuario;
  const esAdmin = adminSesion.rol === 'admin';
  if (esAdmin){
    sessionStorage.setItem("loginMensajeFeedback", "Sesion iniciada correctamente como Administrador");
    sessionStorage.setItem("loginEstadoFeedback", true);
    window.location.href = "/admin/admin.html";
  }else{
    sessionStorage.setItem("loginMensajeFeedback", "Tu sesion esta iniciada, pero no tienes permisos de administracion");
    sessionStorage.setItem("loginEstadoFeedback", false);
    window.location.href = "/index.html";
  }
}

async function loginAdmin(event) {
  event.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  if (!esEmailValido(email)) {
    setFeedback('Introduce un email valido.', false);
    return;
  }
  if (String(password || '').length < 6) {
    setFeedback('La password debe tener al menos 6 caracteres.', false);
    return;
  }

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });

  const payload = await res.json();

  if (!res.ok) {
    setFeedback(payload.mensaje || 'Login incorrecto', false);
    return;
  }

  setFeedback('Sesion iniciada correctamente.', true);
  await comprobarSesion();
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('form-login-admin').addEventListener('submit', loginAdmin);
  await comprobarSesion();
});
