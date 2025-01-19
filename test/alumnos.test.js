// ARRANGE
import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();


let token;
let invalidToken = 'Bearer invalidtoken123';

beforeAll(async () => {
    // Obtener un token válido para las pruebas
    const res = await request(app).post('/api/login').send({
        email: 'darriola.dev@gmail.com',
        password: 'password123',
    });
    token = `Bearer ${res.body.token}`;
});

//ACT
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
        const res = await request(app).get('/api/alumnos/3').set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id_alumno', 3);
    });

    test('Debería devolver 404 si el alumno no existe', async () => {
        const res = await request(app).get('/api/alumnos/9999').set('Authorization', token);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Alumno no encontrado');
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get('/api/alumnos/3');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app).get('/api/alumnos/3').set('Authorization', invalidToken);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});

describe('AlumnosController - getTransaccionesByAlumno', () => {
    test('Debería devolver las transacciones de un alumno con un límite si está autenticado', async () => {
        const res = await request(app)
            .get('/api/alumnos/3/transacciones?limit=5')
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get('/api/alumnos/3/transacciones?limit=5');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app).get('/api/alumnos/3/transacciones?limit=5').set('Authorization', invalidToken);
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});

describe('AlumnosController - getTransaccionesByMonth', () => {
    test('Debería devolver las transacciones de un alumno por mes y año si está autenticado', async () => {
        const res = await request(app)
            .get('/api/alumnos/3/transacciones/mes?mes=12&anio=2023')
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    test('Debería devolver 400 si faltan el mes o el año', async () => {
        const res = await request(app).get('/api/alumnos/3/transacciones/mes').set('Authorization', token);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Debes proporcionar el mes y el año.');
    });

    test('Debería devolver 401 si no se envía el token', async () => {
        const res = await request(app).get('/api/alumnos/3/transacciones/mes?mes=12&anio=2023');
        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Acceso no autorizado');
    });

    test('Debería devolver 401 si el token es inválido', async () => {
        const res = await request(app)
            .get('/api/alumnos/3/transacciones/mes?mes=12&anio=2023')
            .set('Authorization', invalidToken);

        expect(res.statusCode).toBe(401);
        expect(res.body).toHaveProperty('error', 'Token inválido o expirado');
    });
});
