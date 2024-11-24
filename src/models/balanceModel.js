import pool from '../config/db.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class BalanceModel {
    //obtener el estado de cuenta actual de un alumno
    static async getBalanceById(alumno_id) {
        const query = `SELECT * FROM balance where alumno_id = ?`;
        console.log(`SELECT * FROM balance where alumno_id = ${alumno_id}`)

        try {
            const [result] = await pool.query(query, [alumno_id]);
            console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            console.error(`Error executing query: ${error.message}`);
            throw error;
        }
    }
}
