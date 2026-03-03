let adminSesion = null;
let profesores = [];
let cursos = [];

function setFeedback(mensaje, ok) {
  const box = document.getElementById('admin-feedback');
  box.className = 'mb-3 alert';
  box.classList.add(ok ? 'alert-success' : 'alert-danger');
  box.textContent = mensaje;
}

function toggleAdminUI(isAdmin) {
  document.getElementById('bloque-curso-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('btn-logout-admin').style.display = isAdmin ? 'inline-block' : 'none';

  const info = document.getElementById('admin-user-info');
  info.textContent = isAdmin ? `Sesion iniciada como ${adminSesion.nombre} (${adminSesion.email})` : '';
}

function limpiarFormularioCurso() {
  document.getElementById('curso-id').value = '';
  document.getElementById('curso-titulo').value = '';
  document.getElementById('curso-categoria').value = '';
  document.getElementById('curso-nivel').value = '';
  document.getElementById('curso-duracion').value = '';
  document.getElementById('curso-imagen').value = '';
  document.getElementById('curso-descripcion').value = '';
  document.getElementById('curso-temario').value = '';
  document.getElementById('curso-requisitos').value = '';
  if (profesores.length > 0) {
    document.getElementById('curso-profesor').value = profesores[0]._id;
  }
}

function cargarSelectProfesores() {
  const select = document.getElementById('curso-profesor');
  select.innerHTML = profesores
    .map((p) => `<option value="${p._id}">${p.nombre}</option>`)
    .join('');
}

function renderCursosAdmin() {
  const tbody = document.querySelector('#tabla-cursos-admin tbody');

  tbody.innerHTML = cursos
    .map((curso) => {
      const profesorNombre = curso.profesor || 'Sin asignar';
      return `<tr>
        <td>${curso.titulo}</td>
        <td>${curso.categoria}</td>
        <td>${curso.nivel}</td>
        <td>${profesorNombre}</td>
        <td class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="${curso._id}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${curso._id}">Eliminar</button>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('button[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', () => cargarCursoEnFormulario(btn.dataset.id));
  });

  tbody.querySelectorAll('button[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', () => eliminarCurso(btn.dataset.id));
  });
}

function cargarCursoEnFormulario(cursoId) {
  const curso = cursos.find((c) => c._id === cursoId);
  if (!curso) {
    return;
  }

  document.getElementById('curso-id').value = curso._id;
  document.getElementById('curso-titulo').value = curso.titulo;
  document.getElementById('curso-categoria').value = curso.categoria;
  document.getElementById('curso-nivel').value = curso.nivel;
  document.getElementById('curso-duracion').value = curso.duracion;
  document.getElementById('curso-imagen').value = curso.imagen;
  document.getElementById('curso-descripcion').value = curso.descripcion;
  document.getElementById('curso-temario').value = (curso.temario || []).join('\n');
  document.getElementById('curso-requisitos').value = (curso.requisitos || []).join('\n');

  const profesor = profesores.find((p) => p.nombre === curso.profesor);
  if (profesor) {
    document.getElementById('curso-profesor').value = profesor._id;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function cargarDatosAdmin() {
  const [resCursos, resProfesores] = await Promise.all([
    fetch('/api/cursos', { credentials: 'include' }),
    fetch('/api/profesores', { credentials: 'include' })
  ]);

  if (!resCursos.ok || !resProfesores.ok) {
    setFeedback('No se pudieron cargar cursos/profesores', false);
    return;
  }

  cursos = await resCursos.json();
  profesores = await resProfesores.json();

  cargarSelectProfesores();
  limpiarFormularioCurso();
  renderCursosAdmin();
}

async function comprobarSesion() {
  const res = await fetch('/api/auth/me', { credentials: 'include' });

  if (!res.ok) {
    adminSesion = null;
    toggleAdminUI(false);
    return;
  }

  const data = await res.json();
  if (data.usuario.rol !== 'admin') {
    adminSesion = null;
    toggleAdminUI(false);
    setFeedback('Tu sesion no tiene rol admin.', false);
    return;
  }

  adminSesion = data.usuario;
  toggleAdminUI(true);
  await cargarDatosAdmin();
}

async function loginAdmin(event) {
  event.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

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

  if (payload.usuario.rol !== 'admin') {
    setFeedback('La cuenta existe, pero no tiene permisos de administrador.', false);
    return;
  }

  setFeedback('Sesion admin iniciada correctamente.', true);
  await comprobarSesion();
}

async function logoutAdmin() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include'
  });

  if (!res.ok) {
    setFeedback('No se pudo cerrar sesion.', false);
    return;
  }

  adminSesion = null;
  cursos = [];
  toggleAdminUI(false);
  document.querySelector('#tabla-cursos-admin tbody').innerHTML = '';
  setFeedback('Sesion cerrada.', true);
}

function construirPayloadCurso() {
  const temario = document
    .getElementById('curso-temario')
    .value.split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean);
  const requisitos = document
    .getElementById('curso-requisitos')
    .value.split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean);

  return {
    titulo: document.getElementById('curso-titulo').value.trim(),
    categoria: document.getElementById('curso-categoria').value.trim(),
    nivel: document.getElementById('curso-nivel').value.trim(),
    duracion: document.getElementById('curso-duracion').value.trim(),
    imagen: document.getElementById('curso-imagen').value.trim(),
    descripcion: document.getElementById('curso-descripcion').value.trim(),
    profesorId: document.getElementById('curso-profesor').value,
    temario,
    requisitos
  };
}

async function guardarCurso(event) {
  event.preventDefault();

  const cursoId = document.getElementById('curso-id').value;
  const payload = construirPayloadCurso();

  const url = cursoId ? `/api/cursos/${cursoId}` : '/api/cursos';
  const method = cursoId ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });

  const body = await res.json();

  if (!res.ok) {
    setFeedback(body.mensaje || 'No se pudo guardar el curso.', false);
    return;
  }

  setFeedback(body.mensaje || 'Curso guardado correctamente.', true);
  limpiarFormularioCurso();
  await cargarDatosAdmin();
}

async function eliminarCurso(cursoId) {
  const confirmado = window.confirm('¿Seguro que quieres eliminar este curso?');
  if (!confirmado) {
    return;
  }

  const res = await fetch(`/api/cursos/${cursoId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  const body = await res.json();

  if (!res.ok) {
    setFeedback(body.mensaje || 'No se pudo eliminar el curso.', false);
    return;
  }

  setFeedback(body.mensaje || 'Curso eliminado.', true);
  await cargarDatosAdmin();
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('form-login-admin').addEventListener('submit', loginAdmin);
  document.getElementById('btn-logout-admin').addEventListener('click', logoutAdmin);
  document.getElementById('form-curso-admin').addEventListener('submit', guardarCurso);
  document.getElementById('btn-limpiar-form').addEventListener('click', limpiarFormularioCurso);

  toggleAdminUI(false);
  await comprobarSesion();
});
