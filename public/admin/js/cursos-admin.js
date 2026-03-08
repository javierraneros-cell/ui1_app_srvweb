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

function validarPayloadCurso(payload) {
  const obligatorios = ['titulo', 'categoria', 'nivel', 'duracion', 'imagen', 'descripcion', 'profesorId'];
  for (const campo of obligatorios) {
    if (!String(payload[campo] || '').trim()) {
      return `El campo ${campo} es obligatorio.`;
    }
  }
  return null;
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
  const errorValidacion = validarPayloadCurso(payload);
  if (errorValidacion) {
    setFeedback(errorValidacion, false);
    return;
  }

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
  document.getElementById('form-curso-admin').addEventListener('submit', guardarCurso);
  document.getElementById('btn-limpiar-form').addEventListener('click', limpiarFormularioCurso);
  
  await setFeedbackFromStorageSesion();
  await comprobarSesion();

});

async function comprobarSesion() {
  try{
    const res = await fetch('/api/auth/me', { credentials: 'include' });

    if (!res.ok) {
      adminSesion = null;
      toggleCursosAdminUI(false);
      const error = await res.json();
      setFeedback(error.mensaje || 'error.', false);
      return;
    }

    const data = await res.json();
    adminSesion = data.usuario;
    const esAdmin = adminSesion.rol === 'admin';
    toggleCursosAdminUI(esAdmin);

    if (!esAdmin) {
      setFeedback('Tu sesion esta iniciada, pero no tienes permisos de administracion.', false);
      return;
    }

    await cargarDatosAdmin();
  } catch (error) {
    console.error('Error comprobando sesion:', error);
    adminSesion = null;
    toggleCursosAdminUI(false);
  }
}

function toggleCursosAdminUI(isAdmin) {
  document.getElementById('bloque-curso-admin').style.display = isAdmin ? 'block' : 'none';
  document.getElementById('bloque-listado-admin').style.display = isAdmin ? 'block' : 'none';

  const info = document.getElementById('admin-user-info');
  if (!adminSesion) {
    info.textContent = '';
    return;
  }

  info.textContent = `${adminSesion.nombre} (${adminSesion.email}) - Rol: ${adminSesion.rol}`;
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
  renderCursosAdmin();

}