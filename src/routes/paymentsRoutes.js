import { Router } from 'express';
import { PaymentsController } from '../controllers/paymentsController.js';
import { verificarToken, verificarRole } from '../middleware/authMiddleware.js';

export const paymentsRouter = Router();

// Ruta para consultar el balance de un alumno
paymentsRouter.get('/:id', verificarToken, verificarRole(['admin']), PaymentsController.getBalanceById);
// Ruta para registrar un pago de un alumno
paymentsRouter.post('/:id', verificarToken, verificarRole(['admin']), PaymentsController.setBalanceById);