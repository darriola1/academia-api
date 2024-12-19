import pool from '../config/db.js';
import logger from '../logger.js';

export class AlumnosModel {
    static async getAllAlumnos() {
        const query = `SELECT a.id_alumno, a.id_usuario, a.fecha_nacimiento, a.nivel_ingles, u.nombre, u.apellido, u.email, estado.balance_final
                        FROM academia_ingles.alumnos AS a
                        JOIN academia_ingles.usuarios AS u ON u.id_usuario = a.id_usuario
                        JOIN academia_ingles.estado_cuenta AS estado ON estado.alumno_id = a.id_alumno
                        JOIN (
                            SELECT alumno_id, MAX(id) AS ultimo_id
                            FROM academia_ingles.estado_cuenta
                            GROUP BY alumno_id
                        ) AS ultimos ON ultimos.alumno_id = estado.alumno_id AND ultimos.ultimo_id = estado.id;
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
}
