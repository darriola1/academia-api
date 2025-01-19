import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import logger from '../logger.js';

export class UserController {


    static async createUser(req, res) {
        const { nombre, apellido, email, password, idRol, fechaNacimiento, nivelIngles, telefono } = req.body;
        // console.log('idRol: ', idRol)

        try {
            const passwordHash = await bcrypt.hash(password, 10);

            // Crear el usuario en la tabla de usuarios
            const insertResult = await UserModel.createUser(nombre, apellido, email, passwordHash, idRol);
            const insertId = insertResult.insertId;

            // Registrar datos adicionales dependiendo del rol
            if (idRol === 3) { // Suponiendo que 3 es el ID para "Alumno"
                if (!fechaNacimiento || !nivelIngles) {
                    logger.info('Faltan datos obligatorios para registrar un alumno');
                    return res.status(400).json({ error: 'Faltan datos obligatorios para registrar un alumno' });
                }
                await UserModel.createAlumno(insertId, fechaNacimiento, nivelIngles);
            } else if (idRol === 4) { // Suponiendo que 4 es el ID para "Padre"
                if (!telefono) {
                    logger.info('Falta el teléfono para registrar un padre');
                    return res.status(400).json({ error: 'Falta el teléfono para registrar un padre' });
                }
                await UserModel.createPadre(insertId, telefono);
            }

            // Obtener y devolver el usuario creado
            const newUser = await UserModel.getUserById(insertId);
            logger.info(`Usuario ${insertId}: ${email} creado exitosamente con rol ${idRol}`);
            return res.status(201).json(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                logger.error(`Usuario ${email} ya existe`);
                return res.status(409).json({ error: 'El usuario ya existe' });
            } else {
                logger.error(`Error al crear usuario: ${error.message}`);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }

    static async createAlumno(idUsuario, fechaNacimiento, nivelIngles) {
        const query = `INSERT INTO alumnos (id_usuario, fecha_nacimiento, nivel_ingles) VALUES (?, ?, ?)`;
        try {
            const [result] = await pool.query(query, [idUsuario, fechaNacimiento, nivelIngles]);
            return result;
        } catch (error) {
            logger.error(`Error creando alumno: ${error.message}`);
            throw error;
        }
    }

    static async createPadre(idUsuario, telefono) {
        const query = `INSERT INTO padres (id_usuario, telefono) VALUES (?, ?)`;
        try {
            const [result] = await pool.query(query, [idUsuario, telefono]);
            return result;
        } catch (error) {
            logger.error(`Error creando padre: ${error.message}`);
            throw error;
        }
    }


    // Método estático para obtener todos los usuarios.
    static async getAllUsers(req, res) {
        try {
            // Se llama al metodo getAllUsers del modelo de usuarios para obtener todos los usuarios.
            const users = await UserModel.getAllUsers();
            // Se envía la respuesta en formato JSON con todos los usuarios obtenidas.
            return res.json(users);
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
                return res.json(user);
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

    // Método estático para eliminar un usuario.
    static async deleteUser(req, res) {
        const { id } = req.params;

        try {
            const deletedUser = await UserModel.deleteUser(id);

            if (deletedUser.affectedRows > 0) {
                return res.status(200).json({ message: 'Usuario eliminado correctamente' });
            } else {
                return res.status(404).json({ error: 'El usuario no existe o ya ha sido eliminado' });
            }
        } catch (error) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
}
