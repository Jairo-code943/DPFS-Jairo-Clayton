import { Sequelize } from 'sequelize';

//Se conecta a la base de datos usando sequlize, con los parametros de esta misma "nombre base de datos" "usuario" "constrasena"
const db = new Sequelize('productos', 'root', 'root', {
    host:'localhost',
    port:'3306',
    dialect:'mysql'
});
export default db;