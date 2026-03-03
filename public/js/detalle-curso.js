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

async function obtenerCursoPorId(id) {
  const respuesta = await fetch(`/api/cursos/${id}`);

  if (!respuesta.ok) {
    const error = await respuesta.json();
    console.error('Error:', error.mensaje);
    return null;
  }

  return respuesta.json();
}

function renderComentarios(comentarios) {
  const listaComentarios = document.getElementById('lista-comentarios');

  if (!comentarios || comentarios.length === 0) {
    listaComentarios.innerHTML = "<li class='list-group-item'>Todavia no hay comentarios para este curso.</li>";
    return;
  }

  listaComentarios.innerHTML = comentarios
    .map((item) => {
      const autor = item.usuario?.nombre || 'Usuario';
      const fecha = new Date(item.fecha).toLocaleDateString('es-ES');
      return `<li class="list-group-item"><strong>${autor}</strong> (${item.puntuacion}/5) - ${fecha}<br>${item.comentario}</li>`;
    })
    .join('');
}

obtenerCursoPorId(obtenerIdDesdeURL()).then((curso) => {
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
    .map((item) => `<li class="list-group-item">${item}</li>`)
    .join('');

  const requisitos = curso.requisitos || [];

  if (requisitos.length === 0) {
    document.getElementById('lista-requisitos').innerHTML =
      "<li class='list-group-item'>No se requieren requisitos previos.</li>";
  } else {
    document.getElementById('lista-requisitos').innerHTML = requisitos
      .map((item) => `<li class="list-group-item">${item}</li>`)
      .join('');
  }

  renderComentarios(curso.comentarios || []);
});

function imprimirCurso() {
  window.print();
}
