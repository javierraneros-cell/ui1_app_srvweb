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

function toggleAdminUI(isAdmin) {
  document.getElementById('form-login-admin').style.display = adminSesion ? 'none' : 'flex';
  document.getElementById('bloque-curso-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-profesor-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-profesores-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-usuario-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-usuarios-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('btn-logout-admin').style.display = adminSesion ? 'inline-block' : 'none';

  const info = document.getElementById('admin-user-info');
  if (!adminSesion) {
    info.textContent = '';
    return;
  }

  info.textContent = `Sesion iniciada como ${adminSesion.nombre} (${adminSesion.email}) - rol: ${adminSesion.rol}`;
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

function limpiarFormularioProfesor() {
  document.getElementById('profesor-id').value = '';
  document.getElementById('profesor-nombre').value = '';
  document.getElementById('profesor-email').value = '';
  document.getElementById('profesor-especialidad').value = '';
  document.getElementById('profesor-foto').value = '';
}

function limpiarFormularioUsuario() {
  document.getElementById('usuario-id').value = '';
  document.getElementById('usuario-nombre').value = '';
  document.getElementById('usuario-email').value = '';
  document.getElementById('usuario-rol').value = 'alumno';
  document.getElementById('usuario-password').value = '';
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

  cargarSelectProfesores();
  limpiarFormularioCurso();
  limpiarFormularioProfesor();
  limpiarFormularioUsuario();
  renderCursosAdmin();
  renderProfesoresAdmin();
  renderUsuariosAdmin();
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

  setFeedback('Sesion iniciada correctamente.', true);
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
  profesores = [];
  usuarios = [];
  toggleAdminUI(false);
  document.getElementById('form-login-admin').reset();
  document.querySelector('#tabla-cursos-admin tbody').innerHTML = '';
  document.querySelector('#tabla-profesores-admin tbody').innerHTML = '';
  document.querySelector('#tabla-usuarios-admin tbody').innerHTML = '';
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

function construirPayloadProfesor() {
  return {
    nombre: document.getElementById('profesor-nombre').value.trim(),
    email: document.getElementById('profesor-email').value.trim(),
    especialidad: document.getElementById('profesor-especialidad').value.trim(),
    foto: document.getElementById('profesor-foto').value.trim()
  };
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

async function guardarProfesor(event) {
  event.preventDefault();

  const profesorId = document.getElementById('profesor-id').value;
  const payload = construirPayloadProfesor();

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

async function guardarUsuario(event) {
  event.preventDefault();

  const usuarioId = document.getElementById('usuario-id').value;
  const payload = construirPayloadUsuario();

  if (!usuarioId && !payload.password) {
    setFeedback('La password es obligatoria para crear un usuario.', false);
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
  document.getElementById('form-login-admin').addEventListener('submit', loginAdmin);
  document.getElementById('btn-logout-admin').addEventListener('click', logoutAdmin);
  document.getElementById('form-curso-admin').addEventListener('submit', guardarCurso);
  document.getElementById('btn-limpiar-form').addEventListener('click', limpiarFormularioCurso);
  document.getElementById('form-profesor-admin').addEventListener('submit', guardarProfesor);
  document.getElementById('btn-limpiar-profesor').addEventListener('click', limpiarFormularioProfesor);
  document.getElementById('form-usuario-admin').addEventListener('submit', guardarUsuario);
  document.getElementById('btn-limpiar-usuario').addEventListener('click', limpiarFormularioUsuario);

  toggleAdminUI(false);
  await comprobarSesion();
});
