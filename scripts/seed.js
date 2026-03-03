require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('../src/config/database');
const Curso = require('../src/models/Curso');
const Profesor = require('../src/models/Profesor');
const Usuario = require('../src/models/Usuario');
const Comentario = require('../src/models/Comentario');

const DATA_PATH = path.join(__dirname, '..', 'data', 'cursos.json');

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/(^\.|\.$)/g, '');
}

function mapEspecialidad(categoria) {
  const mapa = {
    Tecnología: 'Tecnologia',
    Cívicas: 'Gobierno Abierto',
    Civicas: 'Gobierno Abierto',
    Sociales: 'Accesibilidad Web'
  };

  return mapa[categoria] || 'Formacion General';
}

async function seed() {
  await connectDB();

  const raw = await fs.readFile(DATA_PATH, 'utf8');
  const cursosJson = JSON.parse(raw);

  await Promise.all([
    Curso.deleteMany({}),
    Profesor.deleteMany({}),
    Usuario.deleteMany({}),
    Comentario.deleteMany({})
  ]);

  const profesoresPorNombre = new Map();

  for (const curso of cursosJson) {
    if (!profesoresPorNombre.has(curso.profesor)) {
      const email = `${slugify(curso.profesor)}@globalonline.edu`;

      const profesor = await Profesor.create({
        nombre: curso.profesor,
        email,
        especialidad: mapEspecialidad(curso.categoria),
        foto: '/imagenes/profesores/default.jpg'
      });

      profesoresPorNombre.set(curso.profesor, profesor);
    }
  }

  const cursosParaInsertar = cursosJson.map((curso) => ({
    titulo: curso.titulo,
    categoria: curso.categoria,
    nivel: curso.nivel,
    duracion: curso.duracion,
    descripcion: curso.descripcion,
    imagen: curso.imagen,
    profesorId: profesoresPorNombre.get(curso.profesor)._id,
    temario: curso.contenidos || []
  }));

  const cursosInsertados = await Curso.insertMany(cursosParaInsertar);

  // Usuarios de apoyo para desarrollo (admin + alumnos de prueba)
  const [adminHash, alumno1Hash, alumno2Hash, alumno3Hash] = await Promise.all([
    bcrypt.hash('Admin123!', 10),
    bcrypt.hash('Alumno123!', 10),
    bcrypt.hash('Alumno123!', 10),
    bcrypt.hash('Alumno123!', 10)
  ]);

  const usuarios = await Usuario.insertMany([
    {
      nombre: 'Administrador Global Online',
      email: 'admin@globalonline.edu',
      passwordHash: adminHash,
      rol: 'admin'
    },
    {
      nombre: 'Lucia Torres',
      email: 'lucia.torres@alumnos.globalonline.edu',
      passwordHash: alumno1Hash,
      rol: 'alumno'
    },
    {
      nombre: 'Miguel Santos',
      email: 'miguel.santos@alumnos.globalonline.edu',
      passwordHash: alumno2Hash,
      rol: 'alumno'
    },
    {
      nombre: 'Elena Martin',
      email: 'elena.martin@alumnos.globalonline.edu',
      passwordHash: alumno3Hash,
      rol: 'alumno'
    }
  ]);

  // Comentarios de ejemplo por curso para facilitar desarrollo del detalle/valoraciones
  const comentariosBase = [
    'Curso muy claro y bien estructurado.',
    'Buen contenido practico y aplicable al trabajo diario.',
    'Me gusto la progresion de temas y los ejemplos.',
    'Recomendado para quien quiera una base solida.',
    'Explicaciones directas y faciles de seguir.'
  ];

  const alumnos = usuarios.filter((u) => u.rol === 'alumno');
  const comentariosParaInsertar = [];

  cursosInsertados.forEach((curso, indexCurso) => {
    const comentario1 = {
      usuarioId: alumnos[indexCurso % alumnos.length]._id,
      cursoId: curso._id,
      comentario: comentariosBase[indexCurso % comentariosBase.length],
      puntuacion: (indexCurso % 3) + 3,
      fecha: new Date(Date.now() - indexCurso * 86400000)
    };

    const comentario2 = {
      usuarioId: alumnos[(indexCurso + 1) % alumnos.length]._id,
      cursoId: curso._id,
      comentario: comentariosBase[(indexCurso + 2) % comentariosBase.length],
      puntuacion: ((indexCurso + 1) % 3) + 3,
      fecha: new Date(Date.now() - (indexCurso + 1) * 86400000)
    };

    comentariosParaInsertar.push(comentario1, comentario2);
  });

  await Comentario.insertMany(comentariosParaInsertar);

  console.log('Seed completado');
  console.log(`Profesores: ${await Profesor.countDocuments()}`);
  console.log(`Cursos: ${await Curso.countDocuments()}`);
  console.log(`Usuarios: ${await Usuario.countDocuments()}`);
  console.log(`Comentarios: ${await Comentario.countDocuments()}`);
}

seed().catch((error) => {
  console.error('Error en seed:', error.message);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
