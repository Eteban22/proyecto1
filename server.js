const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const bodyParser = require(`body-parser`);
const app = express();

const { guardarFrutas, leerFrutas } = require("./src/database/electro.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    DB = leerFrutas();
    next();
});

//Manejo de errores simple (TP)
app.get('*', (req, res) => {
    res.status(404).send(`Lo siento, la página que buscas no existe.`);
});

//Ejecución del servidor
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/frutas`);
});