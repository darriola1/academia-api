import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthController {

    static async login(req, res) {
        console.log('req.body', req.body)
        const { email, password } = req.body;
        console.log('email: ', email)
        console.log('password: ', password)

        try {
            // Verificar si el usuario existe
            const [result] = await UserModel.getUserByEmail(email);
            const user = result
            console.log('user: ', user)
            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
            // Verificar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Generar el token JWT con la información del usuario
            const token = jwt.sign(
                { id: user.id_usuario, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

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
}
