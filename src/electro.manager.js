const fs = require("fs");
const path = require("path");

const DB = path.join(__dirname, "./database/electro.json");

function create(frutas) {
    return new Promise((resolve, reject) => {
        fs.writeFile(DB, JSON.stringify(frutas, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se pudo escribir"));

            resolve(true);
        });
    });
}

function leerDB() {
    return new Promise((resolve, reject) => {
        fs.readFile(DB, "utf8", (error, contenido) => {
            if (error) reject(new Error("Error. No se pudo leer"));

            resolve(JSON.parse(contenido));
        });
    });
}

function generarId(electrodomesticos) {
    let mayorId = 0;

    electrodomesticos.forEach((electrodomestico) => {
        if (Number(electrodomestico.id) > mayorId) {
            mayorId = Number(electrodomestico.id);
        }
    });

    return mayorId + 1;
}

async function findOneById(id) {
    if (!id) throw new Error("Error. El Id está indefinido.");

    const electrodomesticos = await leerDB();
    const electrodomestico = electrodomesticos.find((element) => element.id === id);

    if (!electrodomestico) throw new Error("Error. El Id no corresponde a un coche en existencia.");

    return electrodomestico;
}

async function guardarElectrodomestico(electrodomestico) {
    // eslint-disable-next-line max-len
    if (!electrodomestico?.prodType || !electrodomestico?.brand || !electrodomestico?.model || !electrodomestico?.price || !electrodomestico?.stock) throw new Error("Error. Datos incompletos.");

    let electrodomesticos = await leerDB();
    const electrodomesticoConId = { id: generarId(electrodomesticos), ...electrodomestico };

    electrodomesticos.push(electrodomesticoConId);
    await create(electrodomesticos);

    return electrodomesticoConId;
}

async function leerElectrodomestico() {
    const electros = await leerDB();
    return electros;
}

module.exports = { guardarElectrodomestico, leerElectrodomestico, findOneById };