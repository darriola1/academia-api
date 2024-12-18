import { AsistenciaModel } from '../models/asistenciaModel.js';
import logger from '../logger.js';

export class AsistenciaController {

    static async verificarAsistencia(req, res) {

        const { idClase,idAlumno } = req.params;
   
        try {
            
            const result = await AsistenciaModel.verificarAsistencia(idClase,idAlumno);
           
            if (result.length == 0) {
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            const valorAsistencia =  result[0].asistio;          

            if (valorAsistencia == 0) {
                return res.status(200).json({ message: 'No asistio a clase' });               
            } 
            
            if (valorAsistencia == 1) {
                return res.status(200).json({ error: 'Asistio a clase' });
            }
            
            

        } catch (error) {
           
            return res.status(500).json({ error: 'Error interno del servidor' });
     
        }
    }

    static async actualizarAsistencia(req, res) {

        const { idClase,idAlumno } = req.params;
   
        try {
            
            const asistio = await AsistenciaModel.verificarAsistencia(idClase,idAlumno);
            
            if(asistio.length == 0){
                return res.status(404).json({ error: 'Registro no encontrado' });
            }

            const result = await AsistenciaModel.actualizarAsistencia(idClase,idAlumno,asistio[0]);

            
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