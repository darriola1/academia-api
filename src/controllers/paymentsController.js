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
        const { monto, descripcion, tipo_movimiento } = req.body; // Ahora aceptamos `tipo_movimiento`

        try {
            // Validar que el monto sea un número
            if (isNaN(monto)) {
                throw new Error(`El valor de 'monto' debe ser un número válido. Recibido: ${monto}`);
            }

            // Validar el tipo de movimiento
            const tiposValidos = ['factura', 'pago']; // Se pueden agregar mas tipos de ser necesario
            if (!tipo_movimiento || !tiposValidos.includes(tipo_movimiento)) {
                throw new Error(`El valor de 'tipo_movimiento' debe ser uno de: ${tiposValidos.join(', ')}`);
            }

            // Obtener el último balance del alumno
            const [lastRecord] = await PaymentsModel.getBalanceById(alumno_id);

            // Si no hay registros previos, el balance inicial es 0
            const currentBalance = lastRecord ? lastRecord.balance_final : 0;

            // Calcular el nuevo balance
            const newBalance = tipo_movimiento === 'factura'
                ? parseFloat(currentBalance) + parseFloat(monto) // Suma para facturas
                : parseFloat(currentBalance) - parseFloat(monto); // Resta para pagos

            // Registrar el nuevo movimiento en estado_cuenta
            const newRecord = await PaymentsModel.updateBalance({
                alumno_id,
                descripcion: descripcion || (tipo_movimiento === 'factura' ? 'Factura generada' : 'Pago realizado'),
                tipo_movimiento,
                monto: monto,
                balance_final: newBalance,
            });

            logger.info(`El usuario ${usuario_id} ha registrado un ${tipo_movimiento} para el alumno ${alumno_id}`);
            return res.status(200).json(newRecord);
        } catch (error) {
            logger.error(`Error registrando movimiento para el alumno ${alumno_id} por usuario ${usuario_id}: ${error.message}`);
            res.status(500).json({ error: 'Error al registrar el movimiento' });
        }
    }

}
