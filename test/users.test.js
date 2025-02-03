import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

let token;
let tutorId;
let adminId;
let alumnoId;

async function waitForDBSync() {
    await new Promise(r => setTimeout(r, 500));
}

describe('Validación de registros exitosos', () => {
    test('Debería autenticar un usuario y obtener un token', async () => {
        const resLogin = await request(app).post('/api/login').send({
            email: 'darriola.dev@gmail.com',
            password: 'password123',
        });
        token = `Bearer ${resLogin.body.token}`;
        expect(resLogin.statusCode).toBe(200);
        console.log('Token obtenido correctamente');
    });

    test('Debería registrar un tutor correctamente', async () => {
        const resTutor = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 4,
                nombre: 'Tutor Test',
                apellido: 'Ejemplo',
                email: `tutorTest${Date.now()}@example.com`,
                password: 'P@ssw0rd',
                telefono: '099123456',
            });
        tutorId = resTutor.body.idUsuario;
        console.log(`Tutor creado con ID: ${tutorId}`);
        expect(resTutor.statusCode).toBe(201);
    });

    test('Debería registrar un administrador correctamente', async () => {
        const resAdmin = await request(app)
            .post('/api/users/create')
            .set('Authorization', token)
            .send({
                idRol: 1,
                nombre: 'Admin Test',
                apellido: 'Ejemplo',
                email: `adminTest${Date.now()}@example.com`,
                password: 'admin@Pass123',
                telefono: '099987654',
            });
        adminId = resAdmin.body.idUsuario;
        console.log(`Administrador creado con ID: ${adminId}`);
        expect(resAdmin.statusCode).toBe(201);
    });

    test('Debería registrar un alumno asignado al tutor', async () => {
        const resAlumno = await request(app)
            .post('/api/alumnos')
            .set('Authorization', token)
            .send({
                nombre: 'Juan',
                apellido: 'Pérez',
                email: `juanTest${Date.now()}@example.com`,
                password: 'password123',
                telefono: '12345678',
                fechaNacimiento: '2005-06-15',
                nivelIngles: 'First',
                tutorId: tutorId,
            });
        alumnoId = resAlumno.body.idUsuario || resAlumno.body.idAlumno;
        console.log(`Alumno creado con ID: ${alumnoId}, asignado al tutor: ${tutorId}`);
        expect(resAlumno.statusCode).toBe(201);
    });
});

describe('Eliminación de usuarios', () => {
    test('Debería rechazar la eliminación de un tutor con alumnos asignados', async () => {
        // const res = await request(app).delete(`/api/users/${tutorId}`).set('Authorization', token);
        const res = await request(app).delete(`/api/users/3`).set('Authorization', token);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            'error',
            'No se puede eliminar el tutor porque tiene alumnos asignados. Elimine las relaciones primero.'
        );
    });

    test('Debería eliminar un alumno asignado', async () => {
        const res = await request(app).delete(`/api/users/${alumnoId}`).set('Authorization', token);
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
