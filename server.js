const express = require("express");

const dotenv = require("dotenv");

const bodyParser = require(`body-parser`);
const app = express();

const { guardarFrutas, leerFrutas } = require("./src/database/electro.json");
