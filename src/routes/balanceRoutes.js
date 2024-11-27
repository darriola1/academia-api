import { Router } from 'express';
import { BalanceController } from '../controllers/balanceController.js';
import { verificarToken, verificarRole } from '../middleware/authMiddleware.js';

export const balanceRouter = Router();

// Ruta para consultar el balance de un alumno
balanceRouter.get('/:id', verificarToken, verificarRole(['admin']), BalanceController.getBalanceById);
