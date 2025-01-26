import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';

export class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            logger.info('Error en el login: Email y contraseña son obligatorios');
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        try {
            // Verificar si el usuario existe
            const [result] = await UserModel.getUserByEmail(email);
            const user = result;
            // console.log('user: ', user)
            if (!user) {
                logger.info('Error en el login: Usuario no encontrado');
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                logger.info('Error en el login: Contraseña incorrecta');
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            const [userRol] = await UserModel.getRolById(user.id_rol);
            if (!userRol) {
                logger.error('Error obteniendo el rol del usuario');
                return res.status(500).json({ error: 'Error obteniendo el rol del usuario' });
            }
            // Generar el token JWT con la información del usuario
            const token = jwt.sign(
                {
                    id: user.id_usuario,
                    user_name: `${user.nombre} ${user.apellido}`,
                    rol: userRol.nombre_rol,
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            logger.info(`El usuario ${user.id_usuario} se ha logueado correctamente`);
            return res.status(200).json({
                user: {
                    id: user.id_usuario,
                    user_name: `${user.nombre} ${user.apellido}`,
                    rol_nombre: userRol.nombre_rol,
                    email: user.email,
                },
                token,
            });
        } catch (error) {
            logger.error('Error en el login:', error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}
