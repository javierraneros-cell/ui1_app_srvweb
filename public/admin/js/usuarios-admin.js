let adminSesion = null;
let profesores = [];
let cursos = [];
let usuarios = [];

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

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

function validarPayloadUsuario(payload, esCreacion) {
  const obligatorios = ['nombre', 'email', 'rol'];
  for (const campo of obligatorios) {
    if (!String(payload[campo] || '').trim()) {
      return `El campo ${campo} es obligatorio.`;
    }
  }
  if (!esEmailValido(payload.email)) {
    return 'El email del usuario no es valido.';
  }
  if (payload.password && payload.password.length < 6) {
    return 'La password debe tener al menos 6 caracteres.';
  }
  if (esCreacion && !payload.password) {
    return 'La password es obligatoria para crear un usuario.';
  }
  return null;
}

function toggleUsuariosAdminUI(isAdmin) {
  document.getElementById('bloque-usuario-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-usuarios-admin').style.display = isAdmin ? 'block' : 'none';

  const info = document.getElementById('admin-user-info');
  if (!adminSesion) {
    info.textContent = '';
    return;
  }

  info.textContent = `${adminSesion.nombre} (${adminSesion.email}) - Rol: ${adminSesion.rol}`;
}

function limpiarFormularioUsuario() {
  document.getElementById('usuario-id').value = '';
  document.getElementById('usuario-nombre').value = '';
  document.getElementById('usuario-email').value = '';
  document.getElementById('usuario-rol').value = 'alumno';
  document.getElementById('usuario-password').value = '';
}

function renderUsuariosAdmin() {
  const tbody = document.querySelector('#tabla-usuarios-admin tbody');

  tbody.innerHTML = usuarios
    .map((usuario) => {
      const esMiSesion = adminSesion && adminSesion._id === usuario._id;
      return `<tr>
        <td>${usuario.nombre}</td>
        <td>${usuario.email}</td>
        <td>${usuario.rol}</td>
        <td class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" data-action="edit-usuario" data-id="${usuario._id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete-usuario" data-id="${usuario._id}" ${esMiSesion ? 'disabled title="No puedes eliminar tu propia sesion"' : ''}>Eliminar</button>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('button[data-action="edit-usuario"]').forEach((btn) => {
    btn.addEventListener('click', () => cargarUsuarioEnFormulario(btn.dataset.id));
  });

  tbody.querySelectorAll('button[data-action="delete-usuario"]').forEach((btn) => {
    btn.addEventListener('click', () => eliminarUsuario(btn.dataset.id));
  });
}

function cargarUsuarioEnFormulario(usuarioId) {
  const usuario = usuarios.find((u) => u._id === usuarioId);
  if (!usuario) {
    return;
  }

  document.getElementById('usuario-id').value = usuario._id;
  document.getElementById('usuario-nombre').value = usuario.nombre;
  document.getElementById('usuario-email').value = usuario.email;
  document.getElementById('usuario-rol').value = usuario.rol;
  document.getElementById('usuario-password').value = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function cargarDatosAdmin() {
  const [resCursos, resProfesores, resUsuarios] = await Promise.all([
    fetch('/api/cursos', { credentials: 'include' }),
    fetch('/api/profesores', { credentials: 'include' }),
    fetch('/api/usuarios', { credentials: 'include' })
  ]);

  if (!resCursos.ok || !resProfesores.ok || !resUsuarios.ok) {
    setFeedback('No se pudieron cargar cursos/profesores/usuarios', false);
    return;
  }

  cursos = await resCursos.json();
  profesores = await resProfesores.json();
  usuarios = await resUsuarios.json();

  limpiarFormularioUsuario();
  renderUsuariosAdmin();
}

async function comprobarSesion() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });

    if (!res.ok) {
      adminSesion = null;
      toggleUsuariosAdminUI(false);
      const error = await res.json();
      setFeedback(error.mensaje || 'error.', false);
      return;
    }

    const data = await res.json();
    adminSesion = data.usuario;
    const esAdmin = adminSesion.rol === 'admin';
    toggleUsuariosAdminUI(esAdmin);

    if (!esAdmin) {
      setFeedback('Tu sesion esta iniciada, pero no tienes permisos de administracion.', false);
      return;
    }

    await cargarDatosAdmin();

  } catch (error) {
    console.error('Error comprobando sesion:', error);
    adminSesion = null;
    toggleUsuariosAdminUI(false);
  }
}

function construirPayloadUsuario() {
  const payload = {
    nombre: document.getElementById('usuario-nombre').value.trim(),
    email: document.getElementById('usuario-email').value.trim(),
    rol: document.getElementById('usuario-rol').value
  };

  const password = document.getElementById('usuario-password').value.trim();
  if (password) {
    payload.password = password;
  }

  return payload;
}

async function guardarUsuario(event) {
  event.preventDefault();

  const usuarioId = document.getElementById('usuario-id').value;
  const payload = construirPayloadUsuario();
  const esCreacion = !usuarioId;
  const errorValidacion = validarPayloadUsuario(payload, esCreacion);
  if (errorValidacion) {
    setFeedback(errorValidacion, false);
    return;
  }

  const url = usuarioId ? `/api/usuarios/${usuarioId}` : '/api/usuarios';
  const method = usuarioId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const body = await res.json();

  if (!res.ok) {
    setFeedback(body.mensaje || 'No se pudo guardar el usuario.', false);
    return;
  }

  setFeedback(body.mensaje || 'Usuario guardado correctamente.', true);
  limpiarFormularioUsuario();
  await cargarDatosAdmin();
}

async function eliminarUsuario(usuarioId) {
  const confirmado = window.confirm('¿Seguro que quieres eliminar este usuario?');
  if (!confirmado) {
    return;
  }

  const res = await fetch(`/api/usuarios/${usuarioId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const body = await res.json();

  if (!res.ok) {
    setFeedback(body.mensaje || 'No se pudo eliminar el usuario.', false);
    return;
  }

  setFeedback(body.mensaje || 'Usuario eliminado.', true);
  limpiarFormularioUsuario();
  await cargarDatosAdmin();
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('form-usuario-admin').addEventListener('submit', guardarUsuario);
  document.getElementById('btn-limpiar-usuario').addEventListener('click', limpiarFormularioUsuario);
  
  toggleUsuariosAdminUI(false);
  await setFeedbackFromStorageSesion();
  await comprobarSesion();

});
