import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

let token;
let tutorId;
let adminId;

beforeAll(async () => {
    const res = await request(app).post('/api/login').send({
        email: 'darriola.dev@gmail.com',
        password: 'password123',
    });
    token = `Bearer ${res.body.token}`;
});

describe('Validación de errores al registrar usuarios', () => {
    test('Debería rechazar el registro de un tutor con datos incompletos', async () => {
        const res = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 4,
                nombre: 'Tutor',
                apellido: 'Prueba',
                email: `tutor${Date.now()}@example.com`,
                password: 'P@ssw0rd',
                telefono: '',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'Todos los campos son obligatorios');
    });

    test('Debería rechazar el registro con contraseña débil', async () => {
        const res = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 4,
                nombre: 'Tutor',
                apellido: 'Prueba',
                email: `tutor${Date.now()}@example.com`,
                password: 'debil',
                telefono: '099123456',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error', 'La contraseña es demasiado débil');
    });

    test('Debería rechazar el registro si el email ya existe', async () => {
        const uniqueEmail = `tutorDuplicado${Date.now()}@example.com`;
        await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 4,
                nombre: 'Tutor',
                apellido: 'Duplicado',
                email: uniqueEmail,
                password: 'P@ssw0rd',
                telefono: '099123456',
            });

        const resSegundoRegistro = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 4,
                nombre: 'Tutor',
                apellido: 'Duplicado',
                email: uniqueEmail,
                password: 'P@ssw0rd',
                telefono: '099123456',
            });

        expect(resSegundoRegistro.statusCode).toBe(409);
        expect(resSegundoRegistro.body).toHaveProperty('error', 'El usuario ya existe');
    });
});

describe('Validación de registros exitosos', () => {
    test('Debería registrar un tutor correctamente', async () => {
        const uniqueEmail = `tutorExitoso${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 4,
                nombre: 'Tutor',
                apellido: 'Exitoso',
                email: uniqueEmail,
                password: 'P@ssw0rd',
                telefono: '099123456',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Usuario creado correctamente');
        tutorId = res.body.idUsuario;
    });

    test('Debería registrar un administrador correctamente', async () => {
        const uniqueEmail = `admin${Date.now()}@example.com`;
        const res = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 1,
                nombre: 'Admin',
                apellido: 'Ejemplo',
                email: uniqueEmail,
                password: 'admin@Pass123',
                telefono: '099987654',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Usuario creado correctamente');
        adminId = res.body.idUsuario;
    });
});

describe('Métodos para obtener usuarios', () => {
    test('Debería devolver la lista de tutores registrados', async () => {
        const res = await request(app).get('/api/users/tutores').set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });
});


describe('Eliminacion de usuarios', () => {
    test('Debería eliminar un usuario existente', async () => {
        const res = await request(app).delete(`/api/users/${tutorDuplicadoAEliminar}`).set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería rechazar la eliminación de un tutor con alumnos asignados', async () => {

        const uniqueAlumnoMail = `Juan${Date.now()}@example.com`;
        const resAlumno = await request(app)
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
                tutorId: tutorId,
            });

        expect(resAlumno.statusCode).toBe(201);
        expect(resAlumno.body).toHaveProperty('idUsuario');

        const res = await request(app).delete(`/api/users/${tutorId}`).set('Authorization', token);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            'error',
            'No se puede eliminar el tutor porque tiene alumnos asignados. Elimine las relaciones primero.'
        );
    });

    test('Debería eliminar un alumno Mayor', async () => {
        const res = await request(app).delete(`/api/users/${alumnoParaEliminarId}`).set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un alumno Menor', async () => {
        const res = await request(app).delete(`/api/users/${alumnoMenorParaEliminarId}`).set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un tutor sin alumnos asignados', async () => {
        const res = await request(app).delete(`/api/users/${tutorId}`).set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un admin', async () => {
        const res = await request(app).delete(`/api/users/${adminId}`).set('Authorization', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería devolver 404 al intentar eliminar un usuario inexistente', async () => {
        const res = await request(app).delete('/api/users/99999').set('Authorization', token);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'El usuario no existe o ya ha sido eliminado');
    });
});