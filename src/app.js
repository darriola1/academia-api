import express from 'express';
import { getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// Ruta para obtener todos los usuarios
router.get('/users', getAllUsers);

export default router;
