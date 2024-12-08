import { AsistenciaModel } from '../models/asistenciaModel.js';
import logger from '../logger.js';

export class AsistenciaController {

    static async actualizarAsistencia(req, res) {

        const { idClase,idAlumno } = req.params;
   
        try {
            
            const result = await AsistenciaModel.actualizarAsistencia(idClase,idAlumno);

            if (result.affectedRows > 0) {
                return res.status(200).json({ message: 'Asistencia actualizada correctamente' });               
            } else {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

        } catch (error) {
           
            return res.status(500).json({ error: 'Error interno del servidor' });
     
        }
    }
}