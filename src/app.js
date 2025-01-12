import express, { json } from 'express';
import logger from './logger.js';
import cors from "cors";
// import authRoutes from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { asistenciaRouter } from './routes/asistenciaRoutes.js';
import { paymentsRouter } from './routes/paymentsRoutes.js';
import { alumnosRouter } from './routes/alumnosRoutes.js';

// Se define el puerto en el que se ejecutará la API por defecto 4000 si no esta definido
const PORT = process.env.PORT || 4000;

const app = express();
// Se deshabilita el header 'x-powered-by' por "seguridad".
app.disable('x-powered-by');
// Se utiliza el middleware 'json' para el parsing de las solicitudes en formato JSON.
app.use(json());
app.use(cors({
    origin: "http://localhost:3002"
}));
// app.use('/auth', authRoutes);
app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api/asistencia', asistenciaRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/alumnos', alumnosRouter);
app.get('/health', (req, res) => {
    res.status(200).send('API is healthy');
});

// Middleware para manejar solicitudes a rutas no definidas, devuelve un código de estado 404.
app.use((req, res) => {
    res.status(404).send('End Point no valido');
});

// Se inicia el servidor Express y se escucha en el puerto especificado.
// app.listen(PORT);

// // Exportar la aplicación para deploy en Vercel
export default app;
// // console.log(`Server on port: ${port}`);
logger.info(`Server on port: ${PORT}`);
