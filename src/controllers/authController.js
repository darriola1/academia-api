import { UserModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';

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
                    // rol_id: user.id_rol,
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

    // static async createUser(req, res) {
    //     const { nombre, apellido, email, password, idRol } = req.body;
    //     // Validaciones generales
    //     if (!nombre || !apellido || !email || !password || !idRol) {
    //         logger.info('Error en el registro: Todos los campos son obligatorios');
    //         return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    //     }

    //     if (![1, 2, 3, 4].includes(idRol)) {
    //         // Supongamos que estos son roles válidos
    //         return res.status(400).json({ error: 'Rol no válido' });
    //     }

    //     if (password.length < 6) {
    //         logger.info('Error en el registro: La contraseña es demasiado débil');
    //         return res.status(400).json({ error: 'La contraseña es demasiado débil' });
    //     }

    //     try {
    //         // Hasheamos la contraseña antes de guardar el usuario
    //         const passwordHash = await bcrypt.hash(password, 10);

    //         // Insertamos el nuevo usuario en la base de datos
    //         const insertResult = await UserModel.createUser(nombre, apellido, email, passwordHash, idRol);
    //         const insertId = insertResult.insertId;
    //         logger.info(`Usuario registrado con id: ${insertId}`);

    //         // Obtenemos el usuario creado
    //         const newUser = await UserModel.getUserById(insertId);
    //         return res.status(201).json(newUser[0]);
    //     } catch (error) {
    //         if (error.code === 'ER_DUP_ENTRY') {
    //             logger.error(`El usuario ya existe`);
    //             return res.status(409).json({ error: 'El usuario ya existe' });
    //         } else {
    //             logger.error(`Error del servidor`);
    //             return res.status(500).json({ error: 'Error interno del servidor' });
    //         }
    //     }
    // }



}
