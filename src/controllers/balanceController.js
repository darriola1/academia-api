import { BalanceModel } from '../models/balanceModel.js';
import logger from '../logger.js';

export class BalanceController {

    // Método estático para crear un nuevo usuario.
    static async getBalanceById(req, res) {
        console.log('req', req.body)
        const { id } = req.params;
        const usuario_id = 'denis'

        console.log(id)

        try {
            // Hasheamos la contraseña antes de guardar el usuario
            const balance = await BalanceModel.getBalanceById(id);
            logger.info(`El usuario ${usuario_id} ha consultado el balance de ${id}`);
            return res.status(200).json(balance);
        } catch (error) {
            logger.error(`Error consultado balance de ${id} por usuario ${usuario_id}`);
            res.status(500).json({ error: 'Error al obtener balance' });
        }
    }

}
