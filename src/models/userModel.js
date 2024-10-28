import pool from '../config/db.js';


// Clase para manejar las operaciones relacionadas con los Usuarios
export class UserModel {
    // Obtener todos los usuarios
    static async getAllUsers() {
        const query = `SELECT * FROM usuarios`;
        const [result] = await pool.query(query);
        return result;  // Retorna un array con todos los usuarios
    }
}