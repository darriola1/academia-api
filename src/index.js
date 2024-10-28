import express from 'express';
import dotenv from 'dotenv';
// import authRoutes from './routes/authRoutes.js';
import { userRouter } from './routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Rutas de autenticación
// app.use('/auth', authRoutes);

// Rutas de usuarios
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
