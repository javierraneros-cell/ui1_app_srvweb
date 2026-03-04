var cursoActualId = null;

var main = function () {
  'use strict';

  $('#btn-imprimir').on('click', function () {
    imprimirCurso();
  });
};

$(document).ready(main);

function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function obtenerCursoPorId(id) {
  const respuesta = await fetch(`/api/cursos/${id}`);

  if (!respuesta.ok) {
    const error = await respuesta.json();
    console.error('Error:', error.mensaje);
    return null;
  }

  return respuesta.json();
}

async function obtenerComentariosCurso(id) {
  const respuesta = await fetch(`/api/cursos/${id}/comentarios`);

  if (!respuesta.ok) {
    const error = await respuesta.json();
    console.error('Error comentarios:', error.mensaje);
    return [];
  }

  return respuesta.json();
}

async function usuarioAutenticado() {
  const respuesta = await fetch('/api/auth/me', { credentials: 'include' });
  return respuesta.ok;
}

function mostrarRespuestaComentario(mensaje, tipo) {
  const contenedor = document.getElementById('respuesta-comentario');
  contenedor.className = 'mb-3 alert';
  contenedor.classList.add(tipo === 'ok' ? 'alert-success' : 'alert-danger');
  contenedor.textContent = mensaje;
}

function renderFormularioComentario(autenticado) {
  const contenedor = document.getElementById('contenedor-form-comentario');

  if (!autenticado) {
    contenedor.innerHTML = '<p class="mb-3">Inicia sesion para poder publicar un comentario.</p>';
    return;
  }

  contenedor.innerHTML = `
    <form id="form-comentario" class="mb-3">
      <div class="mb-2">
        <label for="comentario-texto" class="form-label">Tu comentario</label>
        <textarea id="comentario-texto" class="form-control" maxlength="1000" required></textarea>
      </div>
      <div class="mb-2">
        <label for="comentario-puntuacion" class="form-label">Puntuacion</label>
        <select id="comentario-puntuacion" class="form-select" required>
          <option value="">Selecciona</option>
          <option value="5">5</option>
          <option value="4">4</option>
          <option value="3">3</option>
          <option value="2">2</option>
          <option value="1">1</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Publicar comentario</button>
    </form>
  `;

  document.getElementById('form-comentario').addEventListener('submit', async (event) => {
    event.preventDefault();

    const comentario = document.getElementById('comentario-texto').value;
    const puntuacion = document.getElementById('comentario-puntuacion').value;

    const respuesta = await fetch(`/api/cursos/${cursoActualId}/comentarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ comentario, puntuacion: Number(puntuacion) })
    });

    const payload = await respuesta.json();

    if (!respuesta.ok) {
      mostrarRespuestaComentario(payload.mensaje || 'No se pudo publicar el comentario', 'error');
      return;
    }

    mostrarRespuestaComentario(payload.mensaje || 'Comentario publicado', 'ok');
    document.getElementById('comentario-texto').value = '';
    document.getElementById('comentario-puntuacion').value = '';

    const comentariosRefrescados = await obtenerComentariosCurso(cursoActualId);
    renderComentarios(comentariosRefrescados || []);
  });
}

function renderComentarios(comentarios) {
  const listaComentarios = document.getElementById('lista-comentarios');

  if (!comentarios || comentarios.length === 0) {
    listaComentarios.innerHTML = "<li class='list-group-item'>Todavia no hay comentarios para este curso.</li>";
    return;
  }

  listaComentarios.innerHTML = comentarios
    .map((item) => {
      const autor = escapeHtml(item.usuario?.nombre || 'Usuario');
      const fecha = new Date(item.fecha).toLocaleDateString('es-ES');
      const comentarioSeguro = escapeHtml(item.comentario);
      return `<li class="list-group-item"><strong>${autor}</strong> (${item.puntuacion}/5) - ${fecha}<br>${comentarioSeguro}</li>`;
    })
    .join('');
}

async function cargarDetalleCurso() {
  cursoActualId = obtenerIdDesdeURL();
  const curso = await obtenerCursoPorId(cursoActualId);

  if (!curso) {
    const contenedorResultado = document.getElementById('contenedor-respuesta-detalle-curso');
    contenedorResultado.textContent = 'Curso no encontrado';
    contenedorResultado.classList.add('alert-danger');
    contenedorResultado.classList.add('alert');
    contenedorResultado.classList.remove('d-none');
    return;
  }

  document.getElementById('imagen-curso').src = curso.imagen;
  document.getElementById('imagen-curso').alt = curso.titulo;

  document.getElementById('titulo-curso').textContent = curso.titulo;
  document.getElementById('descripcion-curso').textContent = curso.descripcion;

  document.getElementById('categoria-curso').textContent = curso.categoria;
  document.getElementById('nivel-curso').textContent = curso.nivel;
  document.getElementById('duracion-curso').textContent = curso.duracion;
  document.getElementById('profesor-curso').textContent = curso.profesor;

  const contenidos = curso.contenidos || curso.temario || [];
  document.getElementById('lista-contenidos').innerHTML = contenidos
    .map((item) => `<li class="list-group-item">${escapeHtml(item)}</li>`)
    .join('');

  const requisitos = curso.requisitos || [];

  if (requisitos.length === 0) {
    document.getElementById('lista-requisitos').innerHTML =
      "<li class='list-group-item'>No se requieren requisitos previos.</li>";
  } else {
    document.getElementById('lista-requisitos').innerHTML = requisitos
      .map((item) => `<li class="list-group-item">${escapeHtml(item)}</li>`)
      .join('');
  }

  const comentarios = await obtenerComentariosCurso(cursoActualId);
  renderComentarios(comentarios || []);
  renderFormularioComentario(await usuarioAutenticado());
}

cargarDetalleCurso();

function imprimirCurso() {
  window.print();
}
