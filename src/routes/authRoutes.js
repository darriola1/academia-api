import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

export const authRouter = Router();

// Ruta para ingresar con un usuario
authRouter.post('/login', AuthController.login);