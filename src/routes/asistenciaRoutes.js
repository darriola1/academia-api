import { Router } from 'express';
import { AsistenciaController } from '../controllers/asistenciaController.js';

export const asistenciaRouter = Router();

asistenciaRouter.put('/:idClase/:idAlumno', AsistenciaController.actualizarAsistencia);

asistenciaRouter.get('/:idClase/:idAlumno', AsistenciaController.verificarAsistencia);


