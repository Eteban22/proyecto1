const fs = require("fs");
const path = require("path");

require('dotenv').config();

const DB = path.join(__dirname, "./database/electro.json");

// Función que guarda los datos en la DB.
function create(electrodomesticos) {
    return new Promise((resolve, reject) => {
        fs.writeFile(DB, JSON.stringify(electrodomesticos, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se pudo escribir"));

            resolve(true);
        });
    });
}

// Función que lee los datos en la DB.
function leerDB() {
    return new Promise((resolve, reject) => {
        fs.readFile(DB, "utf8", (error, contenido) => {
            if (error) reject(new Error("Error. No se pudo leer"));

            resolve(JSON.parse(contenido));
        });
    });
}

// Función que crea los ID de los electrodomesticos.
function crearId(electrodomesticos) {
    let mayorId = 0;

    electrodomesticos.forEach((electrodomestico) => {
        if (Number(electrodomestico.id) > mayorId) {
            mayorId = Number(electrodomestico.id);
        }
    });

    return mayorId + 1;
}

// Función asincrónica que busca un unico electrodomestico en la DB.
async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const electrodomesticos = await leerDB();
    const electrodomestico = electrodomesticos.find((element) => element.id === id);

    if (!electrodomestico) throw new Error("Error. El Id no corresponde a un electrodomestico en existencia.");

    return electrodomestico;
}

// Función asincrónica que actualiza las propiedades de un electrodomestico de la DB.
async function actualizarElectro(electrodomestico) {
    // eslint-disable-next-line max-len
    if (!electrodomestico?.id || !electrodomestico?.prodType || !electrodomestico?.brand || !electrodomestico?.model || !electrodomestico?.price || !electrodomestico?.stock) throw new Error("Error. Datos incompletos.");

    let electrodomesticos = await leerDB();
    const indice = electrodomesticos.findIndex((element) => element.id === electrodomestico.id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a un electrodomestico en existencia.");

    electrodomesticos[indice] = electrodomestico;
    await create(electrodomesticos);

    return electrodomesticos[indice];
}

// Función asincrónica que crea y guarda nuevos electrodomesticos en la DB.
async function guardarElectrodomestico(electrodomestico) {
    // eslint-disable-next-line max-len
    if (!electrodomestico?.prodType || !electrodomestico?.brand || !electrodomestico?.model || !electrodomestico?.price || !electrodomestico?.stock) throw new Error("Error. Datos incompletos.");

    let electrodomesticos = await leerDB();
    const electrodomesticoConId = { id: crearId(electrodomesticos), ...electrodomestico };

    electrodomesticos.push(electrodomesticoConId);
    await create(electrodomesticos);

    return electrodomesticoConId;
}

// Función asincrónica que lee los datos en la DB.
async function leerElectrodomestico() {
    const electros = await leerDB();
    return electros;
}

// Función asincrónica que elimina un electrodomestico en la DB.
async function destroy(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    let electrodomesticos = await leerDB();
    const indice = electrodomesticos.findIndex((element) => element.id === id);

    if (indice < 0) throw new Error("Error. El Id no corresponde a un electrodomestico en existencia.");

    const electrodomestico = electrodomesticos[indice];
    electrodomesticos.splice(indice, 1);
    await create(electrodomesticos);

    return electrodomestico;
}

// Modulo que exporta las funciones asincronas al EP.
module.exports = { guardarElectrodomestico, leerElectrodomestico, findOneById, actualizarElectro, destroy };