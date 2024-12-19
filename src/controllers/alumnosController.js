import { AlumnosModel } from '../models/alumnosModel.js';
import logger from '../logger.js';

const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
};

export class AlumnosController {

    // tiene acceso a todos los alumnos
    static async getAlumnnos(req, res) {
        try {
            // Se llama al metodo getAllAlumnos del modelo de alumnos para obtener todos los usuarios de tipo alumnos y los datos necesarios.
            const alumnos = await AlumnosModel.getAllAlumnos();
            console.log('alumnos: ', alumnos)

            // Transformar los datos
            const alumnosJSON = alumnos.map((alumno) => ({
                id_alumno: alumno.id_alumno,
                edad: calcularEdad(alumno.fecha_nacimiento), // Calcular edad
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                email: alumno.email,
                balance_final: alumno.balance_final
            }));
            console.log('alumnos: ', alumnos)
            // Se envía la respuesta en formato JSON con todos los usuarios obtenidas.
            return res.json(alumnosJSON);
        } catch (error) {
            // Se devuelve error en caso de que exista
            logger.error(`Error executing query: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
