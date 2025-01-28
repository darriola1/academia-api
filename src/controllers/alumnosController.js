import { AlumnosModel } from '../models/alumnosModel.js';
import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
    static async createAlumno(req, res) {
        const { nombre, apellido, email, password, telefono, fechaNacimiento, nivelIngles, tutorId } = req.body;

        if (!nombre || !apellido || !email || !password || !telefono || !fechaNacimiento || !nivelIngles) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios para crear un alumno' });
        }

        const esMenor = calcularEdad(fechaNacimiento) < 18;

        if (esMenor && !tutorId) {
            res.status(400).json({ error: 'El alumno debe tener un tutor asignado' });
        }

        let alumnoId = null;

        try {
            const passwordHash = await bcrypt.hash(password, 10);

            // Crear el usuario base con el rol de alumno (idRol = 3)
            const userResult = await UserModel.createUser({
                nombre,
                apellido,
                email,
                passwordHash,
                rol: 3, // Rol de alumno
                telefono
            });

            if (!userResult || !userResult.insertId) {
                throw new Error('No se pudo crear el usuario base');
            }

            alumnoId = userResult.insertId;

            // Crear el registro específico del alumno
            const alumnoResult = await AlumnosModel.createAlumno(alumnoId, fechaNacimiento, nivelIngles);

            if (!alumnoResult || alumnoResult.affectedRows === 0) {
                throw new Error('No se pudo crear el registro del alumno');
            }

            // Si es menor de edad y tiene tutor asignado
            if (tutorId && esMenor) {
                await AlumnosModel.createRelacionAlumnoTutor(alumnoId, tutorId);
            }

            return res.status(201).json({
                message: 'Alumno creado correctamente',
                idUsuario: alumnoId
            });
        } catch (error) {
            logger.error(`Error creando alumno: ${error.message}`);

            // Si hubo un error y se creó el usuario base, eliminarlo
            if (alumnoId) {
                try {
                    await UserModel.deleteUser(alumnoId);
                    logger.info(`Usuario base con ID ${alumnoId} eliminado debido a un error en el proceso de creación del alumno.`);
                } catch (deleteError) {
                    logger.error(`Error eliminando usuario base con ID ${alumnoId}: ${deleteError.message}`);
                }
            }

            return res.status(500).json({ error: error.message });
        }
    }
    // tiene acceso a todos los alumnos
    static async getAlumnnos(req, res) {
        try {
            const alumnos = await AlumnosModel.getAllAlumnos();
            // Transformar los datos
            const alumnosJSON = alumnos.map((alumno) => ({
                id_usuario: alumno.id_usuario,
                edad: calcularEdad(alumno.fecha_nacimiento), // Calcular edad
                nombre: alumno.nombre,
                apellido: alumno.apellido,
                email: alumno.email,
                nivel: alumno.nivelIngles,
                balance_final: alumno.balance_final
            }));
            return res.json(alumnosJSON);
        } catch (error) {
            // Se devuelve error en caso de que exista
            logger.error(`Error executing query: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async getTutorByAlumno(req, res) {
        const { id: alumno_id } = req.params;
        const { id: usuario_id } = req.user;
        // const { user_name } = req.user;

        try {
            const tutor = await AlumnosModel.getTutorByAlumno(alumno_id);

            if (!tutor || tutor.length === 0) {
                logger.warn(`No se encontró tutor para el alumno con ID ${alumno_id}`);
                return res.status(404).json({ error: 'Tutor no encontrado' });
            }

            return res.status(200).json(tutor[0]);
        } catch (error) {
            logger.error(`Error consultando tutor de ${alumno_id} por usuario ${usuario_id}: ${error.message}`);
            res.status(500).json({ error: 'Error al obtener tutor del alumno' });
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
                tutorId: alumno.tutor,
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
        limit = parseInt(limit, 10) || 5; // Si no hay límite, usa un valor predeterminado 5

        try {
            const transacciones = await AlumnosModel.getTransaccionesByID(alumno_id, limit);
            return res.status(200).json(transacciones);
        } catch (error) {
            logger.error(`Error consultando transacciones del alumno ${alumno_id} por usuario ${usuario_id}:${user_name} : ${error.message}`);
            return res.status(500).json({ error: 'Error al obtener transacciones del alumno' });
        }
    }

    static async getTransaccionesByMonth(req, res) {
        const { id: alumno_id } = req.params;
        const { mes: month, anio: year } = req.query; // Leer mes y año del query string
        const { id: usuario_id, user_name } = req.user;

        if (!month || !year) {
            return res.status(400).json({ error: 'Debes proporcionar el mes y el año.' });
        }

        // Construir fechas de inicio y fin del mes
        const fechaInicio = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const fechaFin = new Date(year, month, 0).toISOString().split('T')[0];

        try {
            const transacciones = await AlumnosModel.getTransaccionesByDate(alumno_id, fechaInicio, fechaFin);
            return res.status(200).json(transacciones);
        } catch (error) {
            logger.error(
                `Error consultando transacciones del mes ${month}/${year} para el alumno ${alumno_id} por usuario ${usuario_id}:${user_name}: ${error.message}`
            );
            return res.status(500).json({ error: 'Error al obtener transacciones del alumno por mes' });
        }
    }


}
