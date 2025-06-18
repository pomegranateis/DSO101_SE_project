import knex from "knex";
import dotenv from "dotenv";

const config = require("../database/knexfile");

dotenv.config();

const db = knex(config.database);

export default db;
