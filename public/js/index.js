/** Este código JavaScript se encarga de:
 * 1) Cargar dinámicamente dos bloques de portada desde API (4.1):
 *    - Nuevos cursos
 *    - Categorías destacadas
 * 2) Mantener la funcionalidad "Leer más / Leer menos" de tarjetas UD4.
 * Archivo: index.js
 */

function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function cargarCursosNuevosHome() {
  const bloque = document.getElementById('bloque-cursos-nuevos');
  if (!bloque) return;

  try {
    const respuesta = await fetch('/api/cursos');
    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los cursos');
    }

    const cursos = await respuesta.json();
    const cursosNuevos = cursos.slice(0, 3);

    bloque.innerHTML = `
      <h2><span class="material-symbols-outlined">calendar_clock</span> Nuevos cursos</h2>
      <p>Últimos cursos publicados en la plataforma:</p>
      <ul class="lista-generica">
        ${cursosNuevos
          .map(
            (curso) =>
              `<li><a href="detalle-curso.html?id=${curso._id}">${escapeHtml(curso.titulo)}</a> (${escapeHtml(
                curso.nivel
              )})</li>`
          )
          .join('')}
      </ul>
    `;
  } catch (_error) {
    bloque.innerHTML = `
      <h2><span class="material-symbols-outlined">calendar_clock</span> Nuevos cursos</h2>
      <p>No se pudieron cargar los cursos en este momento.</p>
    `;
  }
}

async function cargarCategoriasDestacadasHome() {
  const bloque = document.getElementById('bloque-categorias-destacadas');
  if (!bloque) return;

  try {
    const respuesta = await fetch('/api/cursos/categorias');
    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar las categorias');
    }

    const categorias = await respuesta.json();
    const categoriasDestacadas = categorias.slice(0, 5);

    bloque.innerHTML = `
      <h2><span class="material-symbols-outlined">category</span> Categorías destacadas</h2>
      <p>Las principales categorías de cursos disponibles son:</p>
      <ul class="lista-generica">
        ${categoriasDestacadas.map((categoria) => `<li>${escapeHtml(categoria)}</li>`).join('')}
      </ul>
    `;
  } catch (_error) {
    bloque.innerHTML = `
      <h2><span class="material-symbols-outlined">category</span> Categorías destacadas</h2>
      <p>No se pudieron cargar las categorías en este momento.</p>
    `;
  }
}

async function cargarBloquesDinamicosHome() {
  await Promise.all([cargarCursosNuevosHome(), cargarCategoriasDestacadasHome(), cargarFeedbackLogin()]);
}

function prepararBotonesLeerMas() {
  $('.btn-toggle').on('click', function () {
    const card = $(this).closest('.card');
    const corto = card.find('.card-corto');
    const largo = card.find('.card-largo');

    corto.toggle();
    largo.toggle();

    if ($(this).text() === 'Leer más') {
      $(this).text('Leer menos');
    } else {
      $(this).text('Leer más');
    }
  });
}

$(document).ready(function () {
  prepararBotonesLeerMas();
  cargarBloquesDinamicosHome();
});

function cargarFeedbackLogin() {
    const feedbackDiv = document.getElementById("login-feedback");
    const mensaje = sessionStorage.getItem("loginMensajeFeedback");
    const estado = sessionStorage.getItem("loginEstadoFeedback") === "true";

    if (mensaje) {
        const box = document.getElementById('sesion-feedback');
        box.className = 'mb-3 alert';
        box.classList.add(estado ? 'alert-success' : 'alert-danger');
        box.textContent = mensaje;

        // Limpiar para que no vuelva a aparecer al refrescar
        sessionStorage.removeItem("loginMensajeFeedback");
        sessionStorage.removeItem("loginEstadoFeedback");
    }
}

