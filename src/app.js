const express = require('express');
const cors = require('cors');
const session = require('express-session');

const cursosRoutes = require('./routes/cursos.routes');
const profesoresRoutes = require('./routes/profesores.routes');
const authRoutes = require('./routes/auth.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());
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
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api/cursos', cursosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/auth', authRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
