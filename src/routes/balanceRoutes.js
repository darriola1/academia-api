import { Router } from 'express';
import { BalanceController } from '../controllers/balanceController.js';

export const balanceRouter = Router();

// Ruta para consultar el balance de un alumno
balanceRouter.get('/:id', BalanceController.getBalanceById);