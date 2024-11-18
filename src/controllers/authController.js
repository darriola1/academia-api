import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';


export class AuthController {

    static async login(req, res) {
        // console.log('req.body', req.body)
        const { email, password } = req.body;
        // console.log('email: ', email)
        // console.log('password: ', password)

        try {
            // Verificar si el usuario existe
            const [result] = await UserModel.getUserByEmail(email);
            const user = result
            // console.log('user: ', user)
            if (!user) {
                logger.info('Error en el login: Usuario no encontrado');
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                logger.info('Error en el login: Contraseña incorrecta');
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Generar el token JWT con la información del usuario
            const token = jwt.sign(
                { id: user.id_usuario, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            logger.info(`El usuario ${user.id_usuario} se ha logueado correctamente`)
            // Retornar el token junto con la información adicional del usuario
            return res.status(200).json({
                token,
                user: {
                    id: user.id_usuario,
                    rol: user.rol,
                    email: user.email
                }
            });
        } catch (error) {
            console.error('Error en el login:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
    static async createUser(req, res) {
        const { nombre, apellido, email, password, idRol } = req.body;

        // console.log(nombre, apellido, email, password, idRol)

        try {
            // Hasheamos la contraseña antes de guardar el usuario
            const passwordHash = await bcrypt.hash(password, 10);

            // Insertamos el nuevo usuario en la base de datos
            const insertResult = await UserModel.createUser(nombre, apellido, email, passwordHash, idRol);
            const insertId = insertResult.insertId;
            logger.info(`Usuario registrado con id: ${insertId}`);

            // Obtenemos el usuario creado
            const newUser = await UserModel.getUserById(insertId);
            return res.status(201).json(newUser);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                logger.error(`El usuario ya existe`);
                return res.status(409).json({ error: 'El usuario ya existe' });
            } else {
                logger.error(`Error del servidor`);
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
}
