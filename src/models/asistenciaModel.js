import pool from '../config/db.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class AsistenciaModel {

    static async verificarAsistencia(clase_id,alumno_id ) {
        const query = `
            SELECT asistio
            FROM alumnoClase
            WHERE idClase = ? AND idAlumno = ?;`;
        try {

            const [result] = await pool.query(query, [clase_id, alumno_id]);
            return result;   

        } catch (error) {

            throw error;

        }
    }

    //obtener el estado de cuenta actual de un alumno
    static async actualizarAsistencia(clase_id,alumno_id,asistio) {
        
        const query = `
            UPDATE alumnoclase
            SET asistio = NOT asistio
            WHERE idClase = ? AND idAlumno = ?;`;
            
        try {

            const [updated] = await pool.query(query, [clase_id, alumno_id]);
            return updated;   

        } catch (error) {

            throw error;

        }
    }

    
}
