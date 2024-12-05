import { PaymentsModel } from '../models/paymentsModel.js';
import logger from '../logger.js';

export class PaymentsController {
    // Método estático para crear un nuevo usuario.
    static async getBalanceById(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;

        try {
            const balance = await PaymentsModel.getBalanceById(alumno_id);
            logger.info(`El usuario ${usuario_id} ha consultado el balance de ${alumno_id}`);
            return res.status(200).json(balance);
        } catch (error) {
            logger.error(`Error consultado balance de ${alumno_id} por usuario ${usuario_id}`);
            res.status(500).json({ error: 'Error al obtener balance' });
        }
    }
}
