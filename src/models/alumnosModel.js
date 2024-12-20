import pool from '../config/db.js';
import logger from '../logger.js';

export class AlumnosModel {
    static async getAllAlumnos() {
        const query = `SELECT 
                            a.id_alumno, 
                            a.id_usuario, 
                            a.fecha_nacimiento, 
                            a.nivel_ingles, 
                            u.nombre, 
                            u.apellido, 
                            u.email, 
                            estado.balance_final
                        FROM academia_ingles.alumnos AS a
                        JOIN academia_ingles.usuarios AS u ON u.id_usuario = a.id_usuario
                        LEFT JOIN 
                            (
                                SELECT alumno_id, MAX(id) AS ultimo_id
                                FROM academia_ingles.estado_cuenta
                                GROUP BY alumno_id
                            ) AS ultimos ON ultimos.alumno_id = a.id_alumno
                        LEFT JOIN academia_ingles.estado_cuenta AS estado ON estado.alumno_id = ultimos.alumno_id AND estado.id = ultimos.ultimo_id;
                    `;
        // console.log('query: ', query)
        try {
            const [result] = await pool.query(query);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result; // Retorna un array de objetos con todos los usuarios
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }

    static async getStudentById(id) {
        const query = `
                SELECT a.id_alumno, a.fecha_nacimiento, a.nivel_ingles, u.nombre, u.apellido, u.email, u.id_rol FROM academia_ingles.alumnos as a
                JOIN academia_ingles.usuarios as u on u.id_usuario = a.id_usuario
                WHERE id_alumno = ?;
        `;
        console.log('query: ', query)
        try {
            const [result] = await pool.query(query, [id]);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result; // Retorna un array de objetos con todos los usuarios
        } catch (error) {
            logger.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }
}
