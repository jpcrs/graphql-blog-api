import * as Sequelize from "sequelize";
import { ModelsInterface } from "./ModelsInterface";

export interface Dbconnection extends ModelsInterface {
    sequelize: Sequelize.Sequelize;
}