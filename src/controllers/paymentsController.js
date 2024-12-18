import { PaymentsModel } from '../models/paymentsModel.js';
import logger from '../logger.js';

export class PaymentsController {
    // Método estático para obtener el balance de un usuario.
    static async getBalanceById(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        const { user_name } = req.user;

        try {
            const balance = await PaymentsModel.getBalanceById(alumno_id);
            logger.info(`El usuario ${usuario_id}: ${user_name} ha consultado el balance de ${alumno_id}`);
            return res.status(200).json(balance);
        } catch (error) {
            logger.error(`Error consultado balance de ${alumno_id} por usuario ${usuario_id}`);
            res.status(500).json({ error: 'Error al obtener balance' });
        }
    }

    static async setBalanceById(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        const { monto, descripcion } = req.body;
        // console.log('monto: ', monto)
        // console.log('descripcion: ', descripcion)
        try {
            // Validar que el monto sea un número
            if (isNaN(monto)) {
                throw new Error(`El valor de 'monto' debe ser un número válido. Recibido: ${monto}`);
            }
            // Obtener el último balance del alumno
            const [lastRecord] = await PaymentsModel.getBalanceById(alumno_id);

            // Si no hay registros previos, el balance inicial es 0
            const currentBalance = lastRecord ? lastRecord.balance_final : 0;
            // console.log('currentBalance: ', currentBalance)
            // Calcular el nuevo balance
            const newBalance = parseFloat(currentBalance) + parseFloat(monto);

            // Registrar el nuevo movimiento en estado_cuenta
            const newRecord = await PaymentsModel.updateBalance({
                alumno_id,
                //Se setea una descripcion default
                descripcion: descripcion || (monto > 0 ? 'Factura generada' : 'Pago realizado'),
                monto: monto,
                balance_final: newBalance,
            });

            logger.info(`El usuario ${usuario_id} ha actualizado el estado de cuenta del alumno ${alumno_id}`);
            return res.status(200).json(newRecord);
        } catch (error) {
            logger.error(`Error actualizando estado de cuenta del alumno ${alumno_id} por usuario ${usuario_id}: ${error.message}`);
            res.status(500).json({ error: 'Error al actualizar el estado de cuenta' });
        }
    }
}
