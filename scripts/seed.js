require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');
const mongoose = require('mongoose');

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

  await Curso.insertMany(cursosParaInsertar);

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
