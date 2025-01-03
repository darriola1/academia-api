import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import logger from '../logger.js';

export class UserController {


    // Método estático para crear un nuevo usuario.
    static async createUser(req, res) {
        const { nombre, apellido, email, password, idRol } = req.body;

        // console.log(nombre, apellido, email, password, idRol)

        try {
            // Hasheamos la contraseña antes de guardar el usuario
            const passwordHash = await bcrypt.hash(password, 10);

            // Insertamos el nuevo usuario en la base de datos
            const insertResult = await UserModel.createUser(nombre, apellido, email, passwordHash, idRol);
            const insertId = insertResult.insertId;

            // Obtenemos el usuario creado
            const newUser = await UserModel.getUserById(insertId);
            logger.info(`Usuario ${insertId}: ${email} creado exitosamente`);
            return res.status(201).json(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                logger.error(`Usuario ${email} ya existe`);
                return res.status(409).json({ error: 'El usuario ya existe' });
            } else {
                logger.error(`Error ${error.message} al crear usuario: ${email}`);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
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
