import pool from '../config/db.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class UserModel {

    static async createUser(nombre, apellido, email, passwordHash, idRol) {
        const query = `INSERT INTO usuarios (nombre, apellido, email, passwordHash, idRol) VALUES (?, ?, ?, ?, ?)`;
        const [result] = await pool.query(query, [nombre, apellido, email, passwordHash, idRol]);
        return result;
    }

    static async getAllUsers() {
        const query = `SELECT * FROM usuarios`;
        const [result] = await pool.query(query);
        return result;  // Retorna un array con todos los usuarios
    }

    static async getUserById(id) {
        const query = `SELECT * FROM usuarios where id_usuario = ?`;
        const [result] = await pool.query(query, [id]);
        return result;
    }

    static async getUserByEmail(email) {
        const query = `SELECT * FROM usuarios where email = ?`;
        const [result] = await pool.query(query, [email]);
        return result;
    }

    static async updateUser(id, nombre, apellido, email, id_rol) {
        const query = `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, id_rol = ? WHERE id_usuario = ?`
        const [result] = await connection.query(query, [nombre, apellido, email, id_rol, id]);
        return result;
    }

    static async deleteUser(id) {
        const [result] = await connection.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        return result;
    }
}