// ARRANGE
import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();


let token;
// console.log('token: ', token)
let invalidToken = 'Bearer invalidtoken123';
const ID_TUTOR_REGISTRADO = 3;
let alumnoTest;
const ID_ALUMNO_REGISTRADO = 4;

beforeAll(async () => {
    // Obtener un token válido para las pruebas
    const res = await request(app).post('/api/login').send({
        email: 'darriola.dev@gmail.com',
        password: 'password123',
    });
    token = `Bearer ${res.body.token}`;
    // console.log('token: ', token)
});

//ACT
describe('AlumnosController - create Alumno', () => {
    test('Debería crear un alumno con datos válidos', async () => {
        const uniqueAlumnoMail = `Juan${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/alumnos')
            .set('Authorization', token)
            .send({
                nombre: 'Juan',
                apellido: 'Pérez',
                email: uniqueAlumnoMail,
                password: 'password123',
                telefono: '12345678',
                fechaNacimiento: '2005-06-15',
                nivelIngles: 'First',
                tutorId: ID_TUTOR_REGISTRADO,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('idUsuario');
        alumnoTest = res.body.idUsuario;
    });

    test('Debería rechazar la creación de un alumno con campos faltantes', async () => {
        const uniqueAlumnoMail = `Juan${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/alumnos')
            .set('Authorization', token)
            .send({
                nombre: 'Juan',
                email: uniqueAlumnoMail,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test('Debería rechazar un alumno menor de edad sin tutor asignado', async () => {
        const uniqueAlumnoMail = `María${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/alumnos')
            .set('Authorization', token)
            .send({
                nombre: 'María',
                apellido: 'López',
                email: uniqueAlumnoMail,
                password: 'password123',
                telefono: '87654321',
                fechaNacimiento: '2010-01-01',
                nivelIngles: 'First',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('El alumno debe tener un tutor asignado');
    });
});

describe('AlumnosController - getAlumnnos', () => {
    test('Debería devolver la lista de alumnos si está autenticado', async () => {
        const res = await request(app).get('/api/alumnos').set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get('/api/alumnos');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app).get('/api/alumnos').set('Authorization', invalidToken);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});

describe('AlumnosController - getAlumnnosById', () => {
    test('Debería devolver los detalles de un alumno si está autenticado', async () => {
        const res = await request(app).get(`/api/alumnos/${alumnoTest}`).set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id_alumno', alumnoTest);
        expect()
    });

    test('Debería devolver 404 si el alumno no existe', async () => {
        const res = await request(app).get('/api/alumnos/9999').set('Authorization', token);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Alumno no encontrado');
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}`);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app).get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}`).set('Authorization', invalidToken);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});

describe('AlumnosController - getTransaccionesByAlumno', () => {
    test('Debería devolver las transacciones de un alumno con un límite si está autenticado', async () => {
        const res = await request(app)
            .get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/transacciones?limit=5`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/transacciones?limit=5`);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app).get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/transacciones?limit=5`).set('Authorization', invalidToken);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});

describe('AlumnosController - getTransaccionesByMonth', () => {
    test('Debería devolver las transacciones de un alumno por mes y año si está autenticado', async () => {
        const res = await request(app)
            .get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/transacciones/mes?mes=01&anio=2025`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test('Debería devolver 400 si faltan el mes o el año', async () => {
        const res = await request(app).get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/transacciones/mes`).set('Authorization', token);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Debes proporcionar el mes y el año.');
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/transacciones/mes?mes=12&anio=2023`);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app)
            .get(`/api/alumnos/${ID_ALUMNO_REGISTRADO}/mes?mes=12&anio=2023`)
            .set('Authorization', invalidToken);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});
