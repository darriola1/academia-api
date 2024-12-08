import pool from '../config/db.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class AsistenciaModel {
    //obtener el estado de cuenta actual de un alumno
    static async actualizarAsistencia(clase_id,alumno_id ) {
        const query = `
            UPDATE alumnoclase
            SET asistio = TRUE
            WHERE idClase = ? AND idAlumno = ?;
        `;
        try {

            const [updated] = await pool.query(query, [clase_id, alumno_id]);
            return updated;   

        } catch (error) {

            throw error;

        }
    }
}
