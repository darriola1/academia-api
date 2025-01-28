import { Router } from 'express';
import { ClassController } from '../controllers/classController.js';

export const classRouter = Router();

classRouter.get('/',ClassController.getAllClasses);

classRouter.get('/classById/:id',ClassController.getClassById);

classRouter.get('/classByDates/',ClassController.getClassByDates);

classRouter.get('/classByStudent/',ClassController.getClassByStudent);

classRouter.post('/newClass/',ClassController.newClass);

classRouter.delete('/deleteClass/',ClassController.deleteClass);

classRouter.put('/editClass/',ClassController.editClass);

classRouter.post('/addStudentClass/',ClassController.addStudentClass);