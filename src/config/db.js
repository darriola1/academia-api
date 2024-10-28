import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); // Cargamos variables de entorno desde .env

// Creamos un pool de conexiones para la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // cantidad máxima de conexiones que puede tener el pool de conexiones al mismo tiempo | validar cantidad
    queueLimit: 0, // define el número máximo de conexiones que pueden esperar en cola cuando todas | 0 sin limite
});

export default pool;
