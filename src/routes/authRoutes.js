import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';

export const authRouter = Router();

// Ruta para ingresar con un usuario
authRouter.post('/login', AuthController.login);

// Ruta para crear un nuevo usuario.
// authRouter.post('/register', validarDatosUsuario, AuthController.createUser);
// authRouter.post('/register/alumno', AuthController.createAlumno);
// authRouter.post('/register/tutor', AuthController.createTutor);