let adminSesion = null;
let profesores = [];
let cursos = [];
let usuarios = [];

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

function esEmailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

function validarPayloadProfesor(payload) {
  const obligatorios = ['nombre', 'email', 'especialidad', 'foto'];
  for (const campo of obligatorios) {
    if (!String(payload[campo] || '').trim()) {
      return `El campo ${campo} es obligatorio.`;
    }
  }
  if (!esEmailValido(payload.email)) {
    return 'El email del profesor no es valido.';
  }
  return null;
}

function toggleAdminUI(isAdmin) {
  document.getElementById('bloque-profesor-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-profesores-admin').style.display = isAdmin ? 'block' : 'none';

  const info = document.getElementById('admin-user-info');
  if (!adminSesion) {
    info.textContent = '';
    return;
  }

  info.textContent = `${adminSesion.nombre} (${adminSesion.email}) - Rol: ${adminSesion.rol}`;
}

function limpiarFormularioProfesor() {
  document.getElementById('profesor-id').value = '';
  document.getElementById('profesor-nombre').value = '';
  document.getElementById('profesor-email').value = '';
  document.getElementById('profesor-especialidad').value = '';
  document.getElementById('profesor-foto').value = '';
}

function renderProfesoresAdmin() {
  const tbody = document.querySelector('#tabla-profesores-admin tbody');

  tbody.innerHTML = profesores
    .map((profesor) => {
      const cursosAsignados = profesor.numCursos || 0;
      return `<tr>
        <td>${profesor.nombre}</td>
        <td>${profesor.email}</td>
        <td>${profesor.especialidad}</td>
        <td>${cursosAsignados}</td>
        <td class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" data-action="edit-profesor" data-id="${profesor._id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete-profesor" data-id="${profesor._id}" ${cursosAsignados > 0 ? 'disabled title="Tiene cursos asignados"' : ''}>Eliminar</button>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('button[data-action="edit-profesor"]').forEach((btn) => {
    btn.addEventListener('click', () => cargarProfesorEnFormulario(btn.dataset.id));
  });

  tbody.querySelectorAll('button[data-action="delete-profesor"]').forEach((btn) => {
    btn.addEventListener('click', () => eliminarProfesor(btn.dataset.id));
  });
}

function cargarProfesorEnFormulario(profesorId) {
  const profesor = profesores.find((p) => p._id === profesorId);
  if (!profesor) {
    return;
  }

  document.getElementById('profesor-id').value = profesor._id;
  document.getElementById('profesor-nombre').value = profesor.nombre;
  document.getElementById('profesor-email').value = profesor.email;
  document.getElementById('profesor-especialidad').value = profesor.especialidad;
  document.getElementById('profesor-foto').value = profesor.foto;

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

  limpiarFormularioProfesor();
  renderProfesoresAdmin();
}

async function comprobarSesion() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });

  if (!res.ok) {
    adminSesion = null;
    toggleAdminUI(false);
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

  await cargarDatosAdmin();
}

function construirPayloadProfesor() {
  return {
    nombre: document.getElementById('profesor-nombre').value.trim(),
    email: document.getElementById('profesor-email').value.trim(),
    especialidad: document.getElementById('profesor-especialidad').value.trim(),
    foto: document.getElementById('profesor-foto').value.trim()
  };
}

async function guardarProfesor(event) {
  event.preventDefault();

  const profesorId = document.getElementById('profesor-id').value;
  const payload = construirPayloadProfesor();
  const errorValidacion = validarPayloadProfesor(payload);
  if (errorValidacion) {
    setFeedback(errorValidacion, false);
    return;
  }

  const url = profesorId ? `/api/profesores/${profesorId}` : '/api/profesores';
  const method = profesorId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const body = await res.json();

  if (!res.ok) {
    setFeedback(body.mensaje || 'No se pudo guardar el profesor.', false);
    return;
  }

  setFeedback(body.mensaje || 'Profesor guardado correctamente.', true);
  limpiarFormularioProfesor();
  await cargarDatosAdmin();
}

async function eliminarProfesor(profesorId) {
  const confirmado = window.confirm('¿Seguro que quieres eliminar este profesor?');
  if (!confirmado) {
    return;
  }

  const res = await fetch(`/api/profesores/${profesorId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const body = await res.json();

  if (!res.ok) {
    setFeedback(body.mensaje || 'No se pudo eliminar el profesor.', false);
    return;
  }

  setFeedback(body.mensaje || 'Profesor eliminado.', true);
  limpiarFormularioProfesor();
  await cargarDatosAdmin();
}


document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('form-profesor-admin').addEventListener('submit', guardarProfesor);
  document.getElementById('btn-limpiar-profesor').addEventListener('click', limpiarFormularioProfesor);
  
  toggleAdminUI(false);
  await setFeedbackFromStorageSesion();
  await comprobarSesion();

});
