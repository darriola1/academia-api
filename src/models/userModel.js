import pool from '../config/db.js';
import logger from '../logger.js';

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
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getAllUsers() {
        const query = `SELECT * FROM usuarios`;
        try {
            const [result] = await pool.query(query);
            // console.log(`Result: ${JSON.stringify(result)}`);
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
            // console.log(`Result: ${JSON.stringify(result)}`);
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
            return result; // Retorna un array de usuarios con el rol solicitado
        } catch (error) {
            logger.error(`Error ejecutando consulta para usuarios por rol: ${error.message}`);
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
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getRolById(id_rol) {
        const query = `SELECT nombre_rol FROM roles where id_rol = ?`;
        try {
            const [result] = await pool.query(query, [id_rol]);
            // console.log(`Result: ${JSON.stringify(result)}`);
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
            // console.log(`Result: ${JSON.stringify(result)}`);
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
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async createRelacionAlumnoTutor(idAlumno, idTutor) {
        const query = `INSERT INTO relacion_alumno_padre (id_alumno, id_padre) VALUES (?, ?)`;
        try {
            const [result] = await pool.query(query, [idAlumno, idTutor]);
            return result;
        } catch (error) {
            logger.error(`Error creando relación alumno-tutor: ${error.message}`);
            throw error;
        }
    }

    static async createPadre(idUsuario, telefono) {
        const query = `INSERT INTO padres (id_usuario, telefono) VALUES (?, ?)`;
        try {
            const [result] = await pool.query(query, [idUsuario, telefono]);
            return result;
        } catch (error) {
            logger.error(`Error creando tutor: ${error.message}`);
            throw error;
        }
    }

    static async createAlumno(idUsuario, fechaNacimiento, nivelIngles) {
        const query = `INSERT INTO alumnos (id_usuario, fecha_nacimiento, nivel_ingles) VALUES (?, ?, ?)`;
        try {
            const [result] = await pool.query(query, [idUsuario, fechaNacimiento, nivelIngles]);
            return result;
        } catch (error) {
            logger.error(`Error creando alumno: ${error.message}`);
            throw error;
        }
    }

    static async createProfesor(idUsuario, especialidad) {
        const query = `INSERT INTO profesores (id_usuario, especialidad) VALUES (?, ?)`;
        return await pool.query(query, [idUsuario, especialidad]);
    }

    static async getAlumnosByTutor(idTutor) {
        const query = `
            SELECT a.id_alumno, u.nombre, u.apellido, u.email
            FROM relacion_alumno_padre r
            JOIN alumnos a ON r.id_alumno = a.id_alumno
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            WHERE r.id_padre = ?;
        `;
        try {
            const [result] = await pool.query(query, [idTutor]);
            return result;
        } catch (error) {
            logger.error(`Error obteniendo alumnos por tutor: ${error.message}`);
            throw error;
        }
    }
}
