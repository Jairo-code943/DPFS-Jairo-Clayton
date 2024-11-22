const mysql = require('mysql2');

const dbConfig = {
    host: 'localhost:3306',
    user: 'root',
    password: 'root',
    database: '',
    port: 3306, 
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Database connection successful!');
    }
});

module.exports = connection; // Export for use in other parts of your app