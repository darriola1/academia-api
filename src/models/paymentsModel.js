import pool from '../config/db.js';

// Clase para manejar las operaciones relacionadas con los Usuarios
export class PaymentsModel {
    //obtener el estado de cuenta actual de un alumno
    static async getBalanceById(alumno_id) {
        const query = `SELECT alumno_id,balance_final FROM estado_cuenta WHERE alumno_id = ? ORDER BY id DESC LIMIT 1`;
        // console.log(`SELECT balance_final FROM estado_cuenta WHERE alumno_id = ${alumno_id} ORDER BY fecha DESC LIMIT 1 `);

        try {
            const [result] = await pool.query(query, [alumno_id]);
            // console.log(`Result: ${JSON.stringify(result)}`);
            return result;
        } catch (error) {
            // console.error(`Error executing query: ${error.message}`);
            logger.error(`${error.message}`);
            throw error;
        }
    }

    static async updateBalance({ alumno_id, descripcion, monto, balance_final }) {
        const query = `INSERT INTO estado_cuenta (alumno_id, descripcion, monto, balance_final) VALUES (?, ?, ?, ?)`;
        try {
            const [result] = await pool.query(query, [alumno_id, descripcion, monto, balance_final]);
            return {
                id: result.insertId,
                alumno_id,
                descripcion,
                monto,
                balance_final,
                fecha: new Date().toISOString(), // Fecha actual
            };
        } catch (error) {
            // console.error(`Error executing query: ${error.message}`);
            logger.error(`${error.message}`);
            throw error;
        }
    }
}
