import pool from '../config/db.js';
import logger from '../logger.js';

export class AlumnosModel {
    static async createAlumno(idUsuario, fechaNacimiento, nivelIngles) {
        const query = `
            INSERT INTO alumnos (id_alumno, fecha_nacimiento, nivel_ingles)
            VALUES (?, ?, ?)
        `;
        try {
            const [result] = await pool.query(query, [idUsuario, fechaNacimiento, nivelIngles]);
            return result;
        } catch (error) {
            logger.error(`Error creando datos específicos del alumno: ${error.message}`);
            throw error;
        }
    }

    static async createRelacionAlumnoTutor(idAlumno, idTutor) {
        const query = `
            INSERT INTO relacion_alumno_padre (id_alumno, id_padre)
            VALUES (?, ?)
        `;
        try {
            const [result] = await pool.query(query, [idAlumno, idTutor]);
            return result;
        } catch (error) {
            logger.error(`Error creando relación alumno-tutor: ${error.message}`);
            throw error;
        }
    }

    static async getAllAlumnos() {
        const query = `        
        SELECT 
            u.id_usuario AS id_usuario,
            u.nombre AS nombre,
            u.apellido AS apellido,
            u.email AS email,
            a.fecha_nacimiento AS fecha_nacimiento,
            a.nivel_ingles AS nivelIngles,
            r.id_padre AS tutor,
            COALESCE(ec.balance_final, 0) AS balance_final
        FROM usuarios AS u
        LEFT JOIN relacion_alumno_padre AS r ON r.id_alumno = u.id_usuario
        INNER JOIN alumnos AS a ON u.id_usuario = a.id_alumno
        LEFT JOIN (
            SELECT 
                alumno_id,
                balance_final
            FROM estado_cuenta
            WHERE (alumno_id, id) IN (
                SELECT alumno_id, MAX(id)
                FROM estado_cuenta
                GROUP BY alumno_id
            )
        ) AS ec ON ec.alumno_id = u.id_usuario;`;
        try {
            const [result] = await pool.query(query);

            return result; // Retorna un array de objetos con todos los usuarios
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getStudentById(id) {
        const query = `
                SELECT 
                    u.id_usuario, 
                    a.fecha_nacimiento, 
                    a.nivel_ingles, 
                    u.nombre, 
                    u.apellido, 
                    u.email, 
                    u.id_rol, 
                    r.id_padre AS tutor FROM academia_ingles.alumnos as a
                JOIN academia_ingles.usuarios as u on u.id_usuario = a.id_alumno
                LEFT JOIN relacion_alumno_padre AS r ON r.id_alumno = u.id_usuario
                WHERE a.id_alumno = ?;
        `;
        try {
            const [result] = await pool.query(query, [id]);
            return result; // Retorna un array de objetos
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getTransaccionesByID(id, limit) {
        const query = `
                SELECT id,fecha, descripcion, monto, tipo_movimiento FROM academia_ingles.estado_cuenta
                WHERE alumno_id = ?
                ORDER BY fecha DESC limit ?
                    `;
        try {
            const [result] = await pool.query(query, [id, limit]);
            return result // Retorna un array de objetos con todas las transacciones segun el limite
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getTransaccionesByDate(id, fechaInicio, fechaFin) {
        const query = `
                    SELECT id,fecha, descripcion, monto, tipo_movimiento FROM academia_ingles.estado_cuenta
                    WHERE alumno_id = ?
                    AND fecha >= ? AND fecha <= ?
                    ORDER BY id DESC
                    `;
        try {
            const [result] = await pool.query(query, [id, fechaInicio, fechaFin]);
            return result // Retorna un array de objetos con todas las transacciones entre fechas
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getTutorByAlumno(alumnoId) {
        const query = `
            SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.telefono
            FROM relacion_alumno_padre r
            JOIN usuarios u ON r.id_padre = u.id_usuario
            WHERE r.id_alumno = ?;
        `;
        try {
            const [result] = await pool.query(query, [alumnoId]);
            return result; // Retorna el tutor del alumno
        } catch (error) {
            logger.error(`Error verificando tutor por alumno: ${error.message}`);
            throw error;
        }
    }

    static async getAlumnosByTutor(tutorId) {
        const query = `
            SELECT a.id_alumno, u.nombre, u.apellido
            FROM relacion_alumno_padre r
            JOIN alumnos a ON r.id_alumno = a.id_alumno
            JOIN usuarios u ON a.id_usuario = u.id_usuario
            WHERE r.id_padre = ?;
        `;
        try {
            const [result] = await pool.query(query, [tutorId]);
            return result; // Retorna la lista de alumnos relacionados con el tutor
        } catch (error) {
            logger.error(`Error verificando alumnos por tutor: ${error.message}`);
            throw error;
        }
    }
}
