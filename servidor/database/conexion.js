let mysql = require('mysql');

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'producto',
});

conexion.connect(err => {
    if (err) {
        throw error('Error connecting to database:', err);
    } else {
        console.log('Database connection successful!');
    }
});
