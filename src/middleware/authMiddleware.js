import jwt from 'jsonwebtoken';
import logger from '../logger.js';

const verificarToken = (req, res, next) => {
    //obtenemos el token desde el header del request
    const token = req.headers.authorization?.split(' ')[1];
    logger.debug(`Token recibido en middleware: ${req.headers['authorization']}`);
    // console.log(`token: ${token}`);
    if (!token) {
        logger.error('Token no proporcionado');
        return res.status(401).json({ error: 'Acceso no autorizado' });
    }

    try {
        //decodificamos el token y almacenamos los datos en la request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        logger.info(`Token verificado para el usuario: ${JSON.stringify(req.user)}`);
        // se continua con la solicitud
        next();
    } catch (error) {
        logger.error('Error al verificar el token:', error.message);
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

const verificarRole = (allowedRoles) => {
    return (req, res, next) => {
        // El token ya fue verificado, `req.user` tiene los datos del usuario
        if (!req.user || !allowedRoles.includes(req.user.rol)) {
            logger.info(`Acceso denegado para el usuario ${req.user.id} con rol ${req.user.rol}`);
            return res.status(403).json({ error: 'No tienes permiso para acceder a esta ruta' });
        }
        next(); // Si tiene el rol permitido, ir al siguiente middleware o controlador
    };
};


export { verificarToken, verificarRole };
