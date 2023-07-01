const express = require("express");
const { guardarElectrodomestico, leerElectrodomestico, findOneById, actualizarElectro, destroy } = require("./src/electro.manager.js");

require('dotenv').config();

const bodyParser = require(`body-parser`);
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Obtener todos los Electrodomesticos.
app.get('/electro', (req, res) => {
    leerElectrodomestico()
        .then((electrodomesticos) => res.status(200).send(electrodomesticos))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener un Electrodomestico específico.
app.get('/electro/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((coche) => res.status(200).send(coche))
        .catch((error) => res.status(400).send(error.message));
});

// Crear un nuevo Electrodomestico.
app.post('/electro', (req, res) => {
    const { prodType, brand, model, price, stock } = req.body;

    guardarElectrodomestico({ prodType, brand, model, price: Number(price), stock: Number(stock) })
        .then(() => res.status(201).send(`El electrodomestico ${prodType}, marca ${brand}, modelo ${model} fue creado correctamente!</t>`))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar un Electrodomestico específico
app.put('/electro/:id', (req, res) => {
    const { id } = req.params;
    const { prodType, brand, model, price, stock } = req.body;

    actualizarElectro({ id: Number(id), prodType, brand, model, price: Number(price), stock: Number(stock) })
        .then(() => res.status(200).send(`El electrodomestico ${prodType}, marca ${brand}, modelo ${model} fue actualizado correctamente!`))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar un electrodomestico específico.
app.delete('/electro/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((electrodomestico) => res.status(200).send(electrodomestico))
        .catch((error) => res.status(400).send(error.message));
});

//Manejo de errores simple
app.get('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h2>Lo siento, la página ingresada no existe.</h2><h3>Intente nuevamente.</h3>`);
});

//Escucha de peteciones
app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Ejecutandose en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/electro`);
});