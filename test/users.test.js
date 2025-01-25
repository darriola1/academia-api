import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

let token;
let tutorId;

beforeAll(async () => {
    // Obtener un token válido para las pruebas
    const res = await request(app).post('/api/login').send({
        email: 'darriola.dev@gmail.com',
        password: 'password123',
    });
    token = `Bearer ${res.body.token}`;
});

describe('Validación de errores al registrar usuarios', () => {
    test('Debería rechazar el registro de un alumno con datos incompletos', async () => {
        const res = await request(app)
            .post('/api/users/alumno')
            .set('Authorization', token)
            .send({
                nombre: 'Alumno',
                apellido: '', // Apellido vacío
                email: `alumno${Date.now()}@example.com`,
                password: 'password123',
                fechaNacimiento: '2010-04-01',
                nivelIngles: 'Intermedio',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Todos los campos son obligatorios');
    });

    test('Debería rechazar el registro de un alumno con contraseña débil', async () => {
        const res = await request(app)
            .post('/api/users/alumno')
            .set('Authorization', token)
            .send({
                nombre: 'Alumno',
                apellido: 'Prueba',
                email: `alumno${Date.now()}@example.com`,
                password: '123', // Contraseña débil
                fechaNacimiento: '2010-04-01',
                nivelIngles: 'Intermedio',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'La contraseña es demasiado débil');
    });

    test('Debería rechazar el registro de un tutor con datos incompletos', async () => {
        const res = await request(app)
            .post('/api/users/tutor')
            .set('Authorization', token)
            .send({
                nombre: 'Tutor',
                apellido: 'Prueba',
                email: `tutor${Date.now()}@example.com`,
                password: 'password123',
                telefono: '', // Teléfono vacío
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Falta el teléfono del tutor');
    });

    test('Debería rechazar el registro si el email ya existe', async () => {
        const uniqueEmail = `tutorDuplicado${Date.now()}@example.com`;

        // Crear el primer usuario
        await request(app)
            .post('/api/users/tutor')
            .set('Authorization', token)
            .send({
                nombre: 'Tutor',
                apellido: 'Duplicado',
                email: uniqueEmail,
                password: 'password123',
                telefono: '099123456',
            });

        // Intentar crear un usuario con el mismo email
        const res = await request(app)
            .post('/api/users/tutor')
            .set('Authorization', token)
            .send({
                nombre: 'Tutor',
                apellido: 'Duplicado',
                email: uniqueEmail, // Email duplicado
                password: 'password123',
                telefono: '099123456',
            });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error', 'El usuario ya existe');
    });
});

describe('Validación de registros exitosos', () => {
    const uniqueTutorEmail = `tutorExitoso${Date.now()}@example.com`;

    test('Debería registrar un tutor correctamente', async () => {
        const res = await request(app)
            .post('/api/users/tutor')
            .set('Authorization', token)
            .send({
                nombre: 'Tutor',
                apellido: 'Exitoso',
                email: uniqueTutorEmail,
                password: 'password123',
                telefono: '099123456',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Tutor creado correctamente');
        expect(res.body).toHaveProperty('idUsuario');
        tutorId = res.body.idUsuario;
    });

    const uniqueAlumnoEmail = `alumnoExitoso${Date.now()}@example.com`;

    test('Debería registrar un alumno mayor de edad correctamente', async () => {
        const res = await request(app)
            .post('/api/users/alumno')
            .set('Authorization', token)
            .send({
                nombre: 'Alumno',
                apellido: 'Mayor',
                email: uniqueAlumnoEmail,
                password: 'password123',
                fechaNacimiento: '2000-05-15',
                nivelIngles: 'Intermedio',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Alumno creado correctamente');
    });

    const uniqueAlumnoMenorEmail = `alumnoMenor${Date.now()}@example.com`;

    test('Debería registrar un alumno menor de edad con tutor', async () => {
        const res = await request(app)
            .post('/api/users/alumno')
            .set('Authorization', token)
            .send({
                nombre: 'Alumno',
                apellido: 'Menor',
                email: uniqueAlumnoMenorEmail,
                password: 'password123',
                fechaNacimiento: '2010-04-01',
                nivelIngles: 'Básico',
                tutorId: tutorId,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Alumno creado correctamente');
    });
});
