import express, { json } from 'express';
import logger from './logger.js';
import cors from "cors";
// import authRoutes from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { asistenciaRouter } from './routes/asistenciaRoutes.js';
import { paymentsRouter } from './routes/paymentsRoutes.js';
import { alumnosRouter } from './routes/alumnosRoutes.js';
import { classRouter } from './routes/classRoutes.js';

// Se define el puerto en el que se ejecutará la API por defecto 4000 si no esta definido
const PORT = process.env.API_PORT || 4000;

const app = express();
//Esta es una demostracion
// Se deshabilita el header 'x-powered-by' por "seguridad".
app.disable('x-powered-by');
// Se utiliza el middleware 'json' para el parsing de las solicitudes en formato JSON.
app.use(json());
// Descomentar para debugg
// app.use((req, res, next) => {
//     console.log(`Request: ${req.method} ${req.url}`);
//     console.log('Headers:', req.headers);
//     console.log('Body:', req.body);
//     console.log('User: ', req.user)
//     next();
// });
app.use(cors({
    origin: [
        'http://localhost:3002', //env local 
        'https://orange-moss-009b85e10.5.azurestaticapps.net', //env azure
        'https://academia-frontend-alpha.vercel.app', // env de Vercel
        'https://api.mercadopago.com' // Permite solicitudes del Webhook de MercadoPago
    ],
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Permitir cookies/sesiones
}));


app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api/asistencia', asistenciaRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/alumnos', alumnosRouter);
app.use('/api/clases', classRouter);
app.get('/health', (req, res) => {
    res.status(200).send('API is healthy');
});

// Middleware para manejar solicitudes a rutas no definidas, devuelve un código de estado 404.
app.use((req, res) => {
    res.status(404).send('End Point no valido');
});

// Exportar la aplicación para deploy en Vercel
export default app;
logger.info(`Server on port: ${PORT}`);
