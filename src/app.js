const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const cursosRoutes = require('./routes/cursos.routes');
const profesoresRoutes = require('./routes/profesores.routes');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const requestLogger = require('./middlewares/requestLogger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(express.json());
app.use(requestLogger);
app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(
  session({
    name: 'sid',
    secret: process.env.SESSION_SECRET || 'dev-session-secret-change-me',
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sesiones',
      ttl: 60 * 60 * 8
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/cursos', cursosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
