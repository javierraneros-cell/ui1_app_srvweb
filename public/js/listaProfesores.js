var main = function () {
  'use strict';

  $('#cabecera-orden-nombre-0').on('click', function () {
    ordenaPorColumna(this, 0);
  });

  $('#cabecera-orden-especialidad-1').on('click', function () {
    ordenaPorColumna(this, 1);
  });

  $('#cabecera-orden-numcursos-3').on('click', function () {
    ordenaPorColumna(this, 3);
  });
};

$(document).ready(main);

window.addEventListener('load', () => {
  cargarProfesores();
});

async function cargarProfesores() {
  const respuesta = await fetch('/api/profesores');

  if (!respuesta.ok) {
    mostrarError('No se pudo cargar el listado de profesorado.');
    return;
  }

  const profesores = await respuesta.json();
  const tbody = document.querySelector('#tabla-profesores tbody');

  tbody.innerHTML = profesores
    .map(
      (profesor) => `
      <tr>
        <td>${profesor.nombre}</td>
        <td>${profesor.especialidad}</td>
        <td>${profesor.email}</td>
        <td>${profesor.numCursos}</td>
      </tr>`
    )
    .join('');
}

function mostrarError(mensaje) {
  const respuesta = document.getElementById('respuesta-profesores');
  respuesta.textContent = mensaje;
  respuesta.classList.add('alert', 'alert-danger');
  respuesta.classList.remove('d-none');
}

function ordenaPorColumna(th, columna) {
  th.dataset.order = th.dataset.order === 'asc' ? 'desc' : 'asc';
  const orden = th.dataset.order;

  const tabla = document.getElementById('tabla-profesores');
  const tbody = tabla.querySelector('tbody');
  const filas = tbody.rows;

  const filasOrdenadas = ordenarFilas(filas, orden, columna);

  for (let i = 0; i < filasOrdenadas.length; i += 1) {
    const fila = filasOrdenadas[i];
    tbody.appendChild(fila);
  }

  pintaCabeceraOrden(th, orden);
}

function ordenarFilas(filasDesordendas, order, columna) {
  const arrayFilas = [];
  for (const fila of filasDesordendas) {
    arrayFilas.push(fila);
  }

  arrayFilas.sort((elementoA, elementoB) => {
    const valorA = elementoA.children[columna].innerText.trim();
    const valorB = elementoB.children[columna].innerText.trim();

    const numA = parseFloat(valorA.replace(',', '.'));
    const numB = parseFloat(valorB.replace(',', '.'));

    if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
      return order === 'asc' ? numA - numB : numB - numA;
    }

    return order === 'asc' ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
  });

  return arrayFilas;
}

function pintaCabeceraOrden(th, orden) {
  document.querySelectorAll("th[data-sort='true']").forEach((col) => {
    col.classList.remove('asc', 'desc');
  });

  th.classList.add(orden);
}
