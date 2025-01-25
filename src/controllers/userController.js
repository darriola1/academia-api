import { UserModel } from '../models/userModel.js';
import logger from '../logger.js';
import bcrypt from 'bcrypt';

export class UserController {

    static async getTutores(req, res) {
        logger.info(`Request received: ${req.method} ${req.url}`);
        console.log('Controlador getTutores alcanzado');
        try {
            const tutores = [
                { id_usuario: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com' },
                { id_usuario: 2, nombre: 'María', apellido: 'González', email: 'maria@example.com' }
            ];
            return res.status(200).json(tutores);
        } catch (error) {
            logger.error(`Error en controlador: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }



        // // logger.debug('Consultando tutores en la base de datos...');
        // // try {
        // //     const tutores = await UserModel.getUsersByRole(4);
        // //     logger.debug(`Resultado de la consulta: ${JSON.stringify(tutores)}`);

        // //     if (!tutores || tutores.length === 0) {
        // //         logger.info(`Se encontraron ${tutores.length} tutores`);
        // //         logger.warn('No se encontraron tutores registrados');
        // //         return res.status(404).json({ error: 'No se encontraron tutores registrados' });
        // //     }
        // //     logger.info(`Se encontraron ${tutores.length} tutores`);
        // //     // logger.debug(`Token después de procesar /tutores: ${req.headers['authorization']}`);
        // //     return res.status(200).json(tutores);
        // // } catch (error) {
        // //     logger.error(`Error al obtener tutores: ${error.message}`);
        // //     return res.status(500).json({ error: 'Error interno del servidor' });
        // // }

        // logger.debug('Consultando tutores directamente desde el controlador...');
        // const query = `SELECT id_usuario, nombre, apellido, email FROM usuarios WHERE id_rol = ?`;
        // try {
        //     const [result] = await pool.query(query, [4]);
        //     logger.debug(`Resultado directo de la consulta: ${JSON.stringify(result)}`);
        //     if (!result || result.length === 0) {
        //         logger.info('No se encontraron tutores registrados');
        //         return res.status(404).json({ error: 'No se encontraron tutores registrados' });
        //     }
        //     logger.info(`Se encontraron ${result.length} tutores`);
        //     return res.status(200).json(result);
        // } catch (error) {
        //     logger.error(`Error al obtener tutores directamente: ${error.message}`);
        //     return res.status(500).json({ error: 'Error interno del servidor' });
        // }
    }

    // Método estático para obtener todos los usuarios.
    static async getAllUsers(req, res) {
        logger.info(`Request received: ${req.method} ${req.url}`);
        logger.debug(`Token inicial en ${req.method} ${req.url}: ${req.headers['authorization']}`);
        try {
            // Se llama al metodo getAllUsers del modelo de usuarios para obtener todos los usuarios.
            const users = await UserModel.getAllUsers();
            // Se envía la respuesta en formato JSON con todos los usuarios obtenidas.
            return res.status(200).json(users);
        } catch (error) {
            // Se devuelve error en caso de que exista
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Método estático para obtener un usuario por ID.
    static async getUserById(req, res) {
        // logger.info(`Request received: ${req.method} ${req.url}`);
        // logger.debug(`Token inicial en ${req.method} ${req.url}: ${req.headers['authorization']}`);
        const { id } = req.params;
        try {
            const user = await UserModel.getUserById(id);
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ error: `El usuario con id: ${id} no se pudo encontrar` });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    // Método estático para actualizar un usuario.
    static async updateUser(req, res) {
        const { id } = req.params;
        const { nombre, apellido, email, idRol } = req.body;

        try {
            const updatedUser = await UserModel.updateUser(id, nombre, apellido, email, idRol);

            if (updatedUser.affectedRows > 0) {
                const user = await UserModel.getUserById(id);
                return res.status(202).json(user);
            } else {
                return res.status(404).json({ error: `El usuario con id: ${id} no se pudo encontrar para ser actualizado` });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async deleteUser(req, res) {
        const { id } = req.params;

        try {
            // Verificar si es un tutor con alumnos asignados
            const relacionAlumnos = await UserModel.getAlumnosByTutor(id);
            if (relacionAlumnos.length > 0) {
                return res.status(400).json({
                    error: 'No se puede eliminar el tutor porque tiene alumnos asignados. Elimine las relaciones primero.',
                });
            }

            // Proceder con la eliminación
            const deletedUser = await UserModel.deleteUser(id);
            if (deletedUser.affectedRows > 0) {
                return res.status(200).json({ message: 'Usuario eliminado correctamente' });
            } else {
                return res.status(404).json({ error: 'El usuario no existe o ya ha sido eliminado' });
            }
        } catch (error) {
            logger.error(`Error eliminando usuario: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }


    // Función reutilizable para crear usuarios base
    static async createBaseUser({ nombre, apellido, email, password, idRol }) {
        if (!nombre || !apellido || !email || !password || !idRol) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (![1, 2, 3, 4].includes(idRol)) {
            throw new Error('Rol no válido');
        }

        if (password.length < 6) {
            throw new Error('La contraseña es demasiado débil');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        return await UserModel.createUser(nombre, apellido, email, passwordHash, idRol);
    }

    // Crear un alumno
    static async createAlumno(req, res) {
        const { nombre, apellido, email, password, fechaNacimiento, nivelIngles } = req.body;

        if (!fechaNacimiento || !nivelIngles) {
            return res.status(400).json({ error: 'Faltan datos específicos del alumno' });
        }

        try {
            const userResult = await UserController.createBaseUser({
                nombre,
                apellido,
                email,
                password,
                idRol: 3, // Rol 3 = Alumno
            });

            await UserModel.createAlumno(userResult.insertId, fechaNacimiento, nivelIngles);
            return res.status(201).json({ message: 'Alumno creado correctamente', idUsuario: userResult.insertId });
        } catch (error) {
            logger.error(`Error creando alumno: ${error.message}`);
            if (error.message === 'Todos los campos son obligatorios' || error.message === 'Rol no válido' || error.message === 'La contraseña es demasiado débil') {
                return res.status(400).json({ error: error.message });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El usuario ya existe' });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Crear un tutor
    static async createTutor(req, res) {
        const { nombre, apellido, email, password, telefono } = req.body;

        if (!telefono) {
            return res.status(400).json({ error: 'Falta el teléfono del tutor' });
        }
        try {
            const userResult = await UserController.createBaseUser({
                nombre,
                apellido,
                email,
                password,
                idRol: 4, // Rol 4 = Tutor
            });

            await UserModel.createPadre(userResult.insertId, telefono);
            return res.status(201).json({ message: 'Tutor creado correctamente', idUsuario: userResult.insertId });
        } catch (error) {
            logger.error(`Error creando tutor: ${error.message}`);
            if (error.message === 'Todos los campos son obligatorios' || error.message === 'Rol no válido' || error.message === 'La contraseña es demasiado débil') {
                return res.status(400).json({ error: error.message });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El usuario ya existe' });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Crear un profesor
    static async createProfesor(req, res) {
        const { nombre, apellido, email, password, nivelIngles } = req.body;

        if (!nivelIngles) {
            return res.status(400).json({ error: 'Falta el nivel de ingles maximo del profesor' });
        }

        try {
            const userResult = await UserController.createBaseUser({
                nombre,
                apellido,
                email,
                password,
                idRol: 2, // Rol 2 = Profesor
            });

            await UserModel.createProfesor(userResult.insertId, nivelIngles);
            return res.status(201).json({ message: 'Profesor creado correctamente', idUsuario: userResult.insertId });
        } catch (error) {
            logger.error(`Error creando tutor: ${error.message}`);
            if (error.message === 'Todos los campos son obligatorios' || error.message === 'Rol no válido' || error.message === 'La contraseña es demasiado débil') {
                return res.status(400).json({ error: error.message });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El usuario ya existe' });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Crear un admin
    static async createAdmin(req, res) {
        const { nombre, apellido, email, password } = req.body;

        try {
            const userResult = await UserController.createBaseUser({
                nombre,
                apellido,
                email,
                password,
                idRol: 1, // Rol 1 = Admin
            });

            return res.status(201).json({ message: 'Administrador creado correctamente', idUsuario: userResult.insertId });
        } catch (error) {
            logger.error(`Error creando tutor: ${error.message}`);
            if (error.message === 'Todos los campos son obligatorios' || error.message === 'Rol no válido' || error.message === 'La contraseña es demasiado débil') {
                return res.status(400).json({ error: error.message });
            }
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'El usuario ya existe' });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}
