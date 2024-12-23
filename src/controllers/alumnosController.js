import { AlumnosModel } from '../models/alumnosModel.js';
import { PaymentsModel } from '../models/paymentsModel.js';
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
            const alumnos = await AlumnosModel.getAllAlumnos();
            // Transformar los datos
            const alumnosJSON = alumnos.map((alumno) => ({
                id_alumno: alumno.id_alumno,
                edad: calcularEdad(alumno.fecha_nacimiento), // Calcular edad
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                email: alumno.email,
                balance_final: alumno.balance_final
            }));
            return res.json(alumnosJSON);
        } catch (error) {
            // Se devuelve error en caso de que exista
            logger.error(`Error executing query: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async getAlumnnosById(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        const { user_name } = req.user;

        try {
            let alumnoBd = await AlumnosModel.getStudentById(alumno_id);

            if (!alumnoBd || alumnoBd.length === 0) {
                logger.warn(`No se encontró información para el alumno con ID ${alumno_id}`);
                return res.status(404).json({ error: 'Alumno no encontrado' });
            }

            const alumno = alumnoBd[0];
            const balanceResult = await PaymentsModel.getBalanceById(alumno_id);

            const balance = balanceResult.length > 0 ? balanceResult[0].balance_final : 0;

            // Transformar los datos
            const alumnoJSON = {
                id_alumno: alumno.id_alumno,
                edad: calcularEdad(alumno.fecha_nacimiento), // Calcular edad
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                email: alumno.email,
                balance_final: balance
            };

            logger.info(`El usuario ${usuario_id}: ${user_name} ha consultado el detalle de ${alumno_id}: ${alumno.nombre} ${alumno.apellido}`);
            return res.status(200).json(alumnoJSON);
        } catch (error) {
            logger.error(`Error consultado balance de ${alumno_id} por usuario ${usuario_id}: ${error.message}`);
            res.status(500).json({ error: 'Error al obtener detalle del alumno' });
        }
    }

    static async getTransaccionesByAlumno(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        const { user_name } = req.user;
        let { limit } = req.query;

        // Asegúrate de que el límite sea un número entero
        limit = parseInt(limit, 10) || 10; // Si no hay límite, usa un valor predeterminado, como 10

        try {
            const transacciones = await AlumnosModel.getTransaccionesByID(alumno_id, limit);
            console.log('transacciones: ', transacciones);
            return res.status(200).json(transacciones);
        } catch (error) {
            logger.error(`Error consultando transacciones del alumno ${alumno_id} por usuario ${usuario_id}:${user_name} : ${error.message}`);
            return res.status(500).json({ error: 'Error al obtener transacciones del alumno' });
        }
    }

}
