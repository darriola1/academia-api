import pool from '../config/db.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class UserModel {

    static async createUser(nombre, apellido, email, passwordHash, idRol) {
        const query = `INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol) VALUES (?, ?, ?, ?, ?)`;
        // console.log(`Query: ${query}`)
        try {
            const [result] = await pool.query(query, [nombre, apellido, email, passwordHash, idRol]);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getAllUsers() {
        const query = `SELECT * FROM usuarios`;
        try {
            const [result] = await pool.query(query);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;  // Retorna un array de objetos con todos los usuarios
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getUserById(id) {
        const query = `SELECT * FROM usuarios where id_usuario = ?`;
        try {
            const [result] = await pool.query(query, [id]);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getUserByEmail(email) {
        const query = `SELECT * FROM usuarios where email = ?`;
        // console.log(`Query: ${query}`)
        try {
            const [result] = await pool.query(query, [email]);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async updateUser(id, nombre, apellido, email, id_rol) {
        const query = `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, id_rol = ? WHERE id_usuario = ?`
        try {
            const [result] = await connection.query(query, [nombre, apellido, email, id_rol, id]);
            console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async deleteUser(id) {
        const query = 'DELETE FROM usuarios WHERE id_usuario = ?'
        try {
            const [result] = await connection.query(query, [id]);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }
}