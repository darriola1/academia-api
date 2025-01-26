import { UserModel } from '../models/userModel.js';
import logger from '../logger.js';
import bcrypt from 'bcrypt';

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

export class UserController {

    static async createUser(req, res) {
        const { idRol, nombre, apellido, email, password, telefono } = req.body;

        if (!nombre || !apellido || !email || !password || !idRol || !telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const validRoles = [1, 2, 4]; // 1: admin, 2: profesor, 4: padre
        if (!validRoles.includes(idRol)) {
            return res.status(400).json({ error: 'Rol no válido' });
        }

        try {
            const passwordHash = await bcrypt.hash(password, 10);

            const userResult = await UserModel.createUser({
                nombre,
                apellido,
                email,
                passwordHash,
                idRol,
                telefono
            });

            return res.status(201).json({
                message: `Usuario creado correctamente`,
                idUsuario: userResult.insertId
            });
        } catch (error) {
            logger.error(`Error creando usuario ${idRol}: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getTutores(req, res) {
        // logger.info(`Request received: ${req.method} ${req.url}`);
        // console.log('Controlador getTutores alcanzado');
        // logger.debug('Consultando tutores en la base de datos...');
        try {
            const result = await UserModel.getTutores();
            // logger.debug(`Tipo de result: ${typeof result}`);
            // logger.debug(`¿Es array? ${Array.isArray(result)}`);
            // logger.debug(`Contenido del result: ${JSON.stringify(result)}`);
            // const tutores = JSON.stringify(result)
            const tutores = result

            logger.debug(`Tipo de result: ${typeof result}`);
            logger.debug(`Tamaño de result: ${result.length}`);
            // logger.debug(`Resultado de la consulta: ${JSON.stringify(tutores)}`);

            if (!tutores || tutores.length === 0) {
                // logger.info(`Se encontraron ${tutores.length} tutores`);
                logger.warn('No se encontraron tutores registrados');
                return res.status(404).json({ error: 'No se encontraron tutores registrados' });
            }
            // logger.info(`Se encontraron ${tutores.length} tutores`);
            // logger.debug(`Token después de procesar /tutores: ${req.headers['authorization']}`);
            return res.status(200).json(tutores);
        } catch (error) {
            logger.error(`Error al obtener tutores: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

    }

    // Método estático para obtener todos los usuarios.
    static async getAllUsers(req, res) {

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
            // Obtener el usuario por ID
            const [user] = await UserModel.getUserById(id);

            if (!user) {
                return res.status(404).json({ error: 'El usuario no existe o ya ha sido eliminado' });
            }

            const { id_rol } = user;

            // Delegar la eliminación a métodos específicos según el rol
            if (id_rol === 1) return await UserController.deleteAdmin(id, res);
            if (id_rol === 2) return await UserController.deleteProfesor(id, res);
            if (id_rol === 3) return await UserController.deleteAlumno(id, res);
            if (id_rol === 4) return await UserController.deleteTutor(id, res);

            return res.status(400).json({ error: 'Rol no válido para eliminación' });

        } catch (error) {
            logger.error(`Error eliminando usuario: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async deleteAdmin(id, res) {
        try {
            await UserModel.deleteUser(id);
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            logger.error(`Error eliminando administrador: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async deleteProfesor(id, res) {
        try {
            await UserModel.deleteUser(id);
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            logger.error(`Error eliminando profesor: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async deleteAlumno(id, res) {
        try {
            await UserModel.deleteUser(id);
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            logger.error(`Error eliminando alumno: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

    static async deleteTutor(id, res) {
        try {
            const alumnosRelacionados = await UserModel.getAlumnosByTutor(id);
            if (alumnosRelacionados.length > 0) {
                return res.status(400).json({
                    error: 'No se puede eliminar el tutor porque tiene alumnos asignados. Elimine las relaciones primero.',
                });
            }

            await UserModel.deleteUser(id);
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            logger.error(`Error eliminando tutor: ${error.message}`);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }




}
