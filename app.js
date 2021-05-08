const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const createError = require("http-errors");
const app = express();
const routes = require("./src/routes/routes");
const db = require("./src/db");
const path = require("path");
const passport = require('passport')

let corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: [
    "x-auth-token",
    "content-type",
    "X-Requested-With",
    "Authorization",
    "Accept",
    "Origin",
  ],
};

// Aceptar urlparams
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Aceptar json
app.use(express.json());

// Utilizar nuestras rutas
app.use(routes);

// Utilizar nuestra carpeta public
app.use(express.static(path.join(__dirname, "./public")));

// Utilizar seguridad Helmet
app.use(helmet());

// Utilizar seguridad Cors
app.use(cors(corsOption));

// Error 404
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (err.status == 404) {
    res.sendFile(path.join(__dirname, "./public/404.html"));
  } else {
    res.json({
      status: err.status,
      error: err.message,
    });
  }
});

//Inicializar passport

app.use(passport.initialize())

app.use(passport.session())

db.then(() => {
    console.log("Conectado a la base de datos garito");

    // Escuchar puerto 3000
    app.listen(3000, () => {
      console.log("Servidor Iniciado Express");
    });
  })
  .catch(function (err) {
    console.log(`Error al conectar a la base de datos: ${err}`);
  });
