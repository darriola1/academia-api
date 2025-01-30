import pool from '../config/db.js';
import logger from '../logger.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class UserModel {

    static async createUser({ nombre, apellido, email, passwordHash, idRol, telefono }) {
        const query = `
            INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol, telefono)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        try {
            const [result] = await pool.query(query, [nombre, apellido, email, passwordHash, idRol, telefono]);
            return result; // Devuelve el ID del usuario creado
        } catch (error) {
            logger.error(`Error creando usuario con rol ${idRol}: ${error.message}`);
            throw error;
        }
    }

    static async getAllUsers() {
        const query = `SELECT * FROM usuarios`;
        try {
            const [result] = await pool.query(query);

            return result; // Retorna un array de objetos con todos los usuarios
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getUserById(id) {
        const query = `SELECT * FROM usuarios where id_usuario = ?`;
        try {
            const [result] = await pool.query(query, [id]);

            return result;
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getUsersByRole(idRol) {

        const query = `SELECT id_usuario, nombre, apellido, email FROM usuarios WHERE id_rol = ?`;

        try {
            const [result] = await pool.query(query, [idRol]);

            return result;
        } catch (error) {
            logger.error(`Error ejecutando consulta para usuarios por rol: ${error.message}`);
            throw error;
        }
    }

    static async getTutores() {
        const query = `SELECT u.id_usuario, p.id_padre, u.nombre, u.apellido, u.email, p.telefono FROM usuarios u JOIN padres as p on p.id_usuario = u.id_usuario`;
        try {
            const [result] = await pool.query(query);

            return result;
        } catch (error) {
            logger.error(`Error ejecutando consulta de tutores: ${error.message}`);
            throw error;
        }
    }

    static async getUserByEmail(email) {
        const query = `SELECT * FROM usuarios where email = ?`;
        try {
            const [result] = await pool.query(query, [email]);
            return result;
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getRolById(id_rol) {
        const query = `SELECT nombre_rol FROM roles where id_rol = ?`;
        try {
            const [result] = await pool.query(query, [id_rol]);
            return result;
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async updateUser(id, nombre, apellido, email, id_rol) {
        const query = `UPDATE usuarios SET nombre = ?, apellido = ?, email = ?, id_rol = ? WHERE id_usuario = ?`;
        try {
            const [result] = await pool.query(query, [nombre, apellido, email, id_rol, id]);
            return result;
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async deleteUser(id) {
        const query = 'DELETE FROM usuarios WHERE id_usuario = ?';
        try {
            const [result] = await pool.query(query, [id]);
            return result;
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }
}
