import { Router } from 'express';
import { AlumnosController } from '../controllers/alumnosController.js';
import { verificarToken, verificarRole } from '../middleware/authMiddleware.js';

export const alumnosRouter = Router();

// Ruta para consultar todos los alumnos - Solo Admins
alumnosRouter.get('/', verificarToken, verificarRole(['admin']), AlumnosController.getAlumnnos);
// Ruta para crear alumno
alumnosRouter.post('/', verificarToken, verificarRole(['admin']), AlumnosController.createAlumno);

// Ruta para consultar detalle de un alumno - Solo Admins y tutores
alumnosRouter.get('/:id', verificarToken, verificarRole(['admin']), AlumnosController.getAlumnnosById);
alumnosRouter.get('/:id/transacciones', verificarToken, verificarRole(['admin']), AlumnosController.getTransaccionesByAlumno);
alumnosRouter.get('/:id/transacciones/mes', verificarToken, verificarRole(['admin']), AlumnosController.getTransaccionesByMonth);
alumnosRouter.get('/:id/:tutor', verificarToken, verificarRole(['admin']), AlumnosController.getTutorByAlumno);