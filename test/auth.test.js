//ARRANGE
import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

describe('Auth Module - Login', () => {
    test('Debería autenticar un usuario válido y devolver un token', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'darriola.dev@gmail.com',
                password: 'password123',
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    test('Debería rechazar credenciales inválidas', async () => {
        const res = await request(app).post('/api/login').send({
            email: 'usuario@falso.com',
            password: '123456',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error).toBe('Credenciales inválidas');
    });

    test('Debería rechazar el login para una contraseña incorrecta', async () => {
        const res = await request(app).post('/api/login').send({
            email: 'usuario.valido@example.com',
            password: 'passwordIncorrecta',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Credenciales inválidas');
    });

    test('Debería rechazar el login con datos incompletos', async () => {
        const res = await request(app).post('/api/login').send({
            email: '', // Email vacío
            password: 'password123',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Email y contraseña son obligatorios');
    });
});

describe('Auth Module - Registro de Usuarios', () => {
    const uniqueEmail = `test${Date.now()}@example.com`;

    test('Debería registrar un usuario nuevo con datos válidos', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombre: 'Juan',
                apellido: 'Pérez',
                email: `${uniqueEmail}`,
                password: 'password123',
                idRol: 2, // 2 es un rol válido profesor
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id_usuario');
        expect(res.body.nombre).toBe('Juan');
    });

    test('Debería rechazar el registro si el email ya existe', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombre: 'Juan',
                apellido: 'Pérez',
                email: `${uniqueEmail}`,
                password: 'password123',
                idRol: 2,
            });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error', 'El usuario ya existe');
    });

    test('Debería rechazar el registro con datos incompletos', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombre: 'Juan',
                apellido: '', // Falta el apellido
                email: `${uniqueEmail}`,
                password: 'password123',
                idRol: 2,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Todos los campos son obligatorios');
    });
    const uniqueEmail2 = `test${Date.now()}@example.com`;

    test('Debería rechazar el registro con una contraseña débil', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombre: 'Juan',
                apellido: 'Pérez',
                email: `${uniqueEmail2}`,
                password: '123', // Contraseña débil
                idRol: 2,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'La contraseña es demasiado débil');
    });

    const uniqueEmail3 = `test${Date.now()}@example.com`;

    test('Debería rechazar el registro con un rol no válido', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombre: 'Juan',
                apellido: 'Pérez',
                email: `${uniqueEmail3}`,
                password: 'password123',
                idRol: 99, // Rol no válido
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Rol no válido');
    });
});
