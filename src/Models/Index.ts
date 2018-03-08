import * as fs from "fs";
import * as path from "path";
import * as Sequelize from "sequelize";
import { Dbconnection } from "../Interfaces/DbConnectionInterface";
import config from '../config/config';

const basename: string = path.basename(module.filename);
const env: string = process.env.NODE_ENV || "development";
// let config = require(path.resolve(`${__dirname}./../config/config.json`))[env];
let db = null;

if (!db) {
    db = {};
    const operatorsAlises = false;

    let configObject = {...config[env], operatorsAlises};

    const sequelize: Sequelize.Sequelize = new Sequelize(
        configObject.database,
        configObject.username,
        configObject.password,
        configObject
    );

    fs.readdirSync(__dirname)
        .filter((file: string) => {
            return (file.indexOf('.') !== 0 && file != basename && file.slice(-3) === '.js');
        })
        .forEach((file: string) => {
            const model = sequelize.import(path.join(__dirname, file));
            db[model['name']] = model;
        });

    Object.keys(db).forEach((modelName: string) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db['sequelize'] = sequelize;
}

export default <Dbconnection>db;
