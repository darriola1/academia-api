import { Router } from 'express';
import { UserController } from '../controllers/userController.js';

// Se crea un enrutador utilizando el módulo Router de Express.
export const userRouter = Router();

// Ruta para obtener todos los usuarios.
userRouter.get('/', UserController.getAllUsers);

// Ruta para obtener un usuario por ID.
userRouter.get('/:id', UserController.getUserById);

// Ruta para eliminar un usuario por ID.
userRouter.delete('/:id', UserController.deleteUser);

// Ruta para actualizar un usuario por ID.
userRouter.put('/:id', UserController.updateUser);

// // Ruta para ingresar con un usuario
// userRouter.post('/login', UserController.login);

// // Ruta para crear un nuevo usuario.
// userRouter.post('/register', UserController.createUser);