import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { verificarToken, verificarRole } from '../middleware/authMiddleware.js';

// Se crea un enrutador utilizando el módulo Router de Express.
export const userRouter = Router();

// Ruta para obtener todos los usuarios.
userRouter.get('/', verificarToken, verificarRole(['admin']), UserController.getAllUsers);

// Ruta para obtener un usuario por ID.
userRouter.get('/:id', verificarToken, verificarRole(['admin']), UserController.getUserById);

// Ruta para eliminar un usuario por ID.
userRouter.delete('/:id', verificarToken, verificarRole(['admin']), UserController.deleteUser);

// Ruta para actualizar un usuario por ID.
userRouter.put('/:id', verificarToken, verificarRole(['admin']), UserController.updateUser);