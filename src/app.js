import express, { json } from 'express';
// import authRoutes from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';
import { authRouter } from './routes/authRoutes';

// Se define el puerto en el que se ejecutará la API por defecto 4000 si no esta definido
const port = process.env.API_PORT ?? 4000;

const app = express();
// Se deshabilita el header 'x-powered-by' por "seguridad".
app.disable('x-powered-by');
// Se utiliza el middleware 'json' para el parsing de las solicitudes en formato JSON.
app.use(json());
// app.use('/auth', authRoutes);
app.use('/api', authRouter);
app.use('/api/users', userRouter);

// Middleware para manejar solicitudes a rutas no definidas, devuelve un código de estado 404.
app.use((req, res) => {
    res.status(404).send('End Point no valido');
});

// Se inicia el servidor Express y se escucha en el puerto especificado.
app.listen(port);
console.log(`Server on port: ${port}`);