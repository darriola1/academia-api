import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

let token;
let tutorId;
let tutorDuplicadoAEliminar;
let tutorConAlumnosId;
let tutorSinAlumnosId;
let alumnoParaEliminarId;
let alumnoMenorParaEliminarId;
let adminId;

beforeAll(async () => {
    const res = await request(app).post('/api/login').send({
        email: 'darriola.dev@gmail.com',
        password: 'password123',
    });
    token = `Bearer ${res.body.token}`;
});


describe('Validación de errores al registrar usuarios', () => {
    test('Debería rechazar el registro de un alumno con datos incompletos', async () => {
        const res = await request(app)
            .post('/api/users/create')
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
        const resPrimerRegistro = await request(app)
            .post('/api/users/tutor')
            .set('Authorization', token)
            .send({
                nombre: 'Tutor',
                apellido: 'Duplicado',
                email: uniqueEmail,
                password: 'password123',
                telefono: '099123456',
            });
        tutorDuplicadoAEliminar = resPrimerRegistro.body.idUsuario;
        // Intentar crear un usuario con el mismo email
        const resSegundoRegistro = await request(app)
            .post('/api/users/tutor')
            .set('Authorization', token)
            .send({
                nombre: 'Tutor',
                apellido: 'Duplicado',
                email: uniqueEmail, // Email duplicado
                password: 'password123',
                telefono: '099123456',
            });

        expect(resSegundoRegistro.statusCode).toBe(409);
        expect(resSegundoRegistro.body).toHaveProperty('error', 'El usuario ya existe');
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
        alumnoParaEliminarId = res.body.idUsuario;
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
        alumnoMenorParaEliminarId = res.body.idUsuario;
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Alumno creado correctamente');
    });

    test('Debería registrar un administrador correctamente', async () => {
        const uniqueAdminEmail = `admin${Date.now()}@example.com`;

        const res = await request(app)
            .post('/api/users/admin')
            .set('Authorization', token)
            .send({
                nombre: 'Admin',
                apellido: 'Exitoso',
                email: uniqueAdminEmail,
                password: 'password123',
            });

        adminId = res.body.idUsuario
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Administrador creado correctamente');
        expect(res.body).toHaveProperty('idUsuario');
    });

});

describe('Metodos para obtener usuarios', () => {

    test('Debería devolver la lista de tutores registrados', async () => {
        const res = await request(app).get('/api/users/tutores').set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

});

describe('Actualizacion de datos de usuarios', () => {
    test('Debería actualizar un usuario existente', async () => {
        const res = await request(app)
            .put(`/api/users/${tutorId}`) // Asume que el usuario con ID 1 existe
            .set('Authorization', token)
            .send({
                nombre: 'NuevoNombre',
                apellido: 'NuevoApellido',
                email: `actualizado${Date.now()}@example.com`,
                idRol: 2,
            });

        expect(res.statusCode).toBe(202);
        expect(res.body[0]).toHaveProperty('nombre', 'NuevoNombre');
    });

    test('Debería devolver 404 al intentar actualizar un usuario inexistente', async () => {
        const res = await request(app)
            .put('/api/users/99999')
            .set('Authorization', token)
            .send({
                nombre: 'Nombre',
                apellido: 'Apellido',
                email: `usuario${Date.now()}@example.com`,
                idRol: 3,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'El usuario con id: 99999 no se pudo encontrar para ser actualizado');
    });

});

describe('Eliminacion de usuarios', () => {
    test('Debería eliminar un usuario existente', async () => {

        const res = await request(app).delete(`/api/users/${tutorDuplicadoAEliminar}`).set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería rechazar la eliminación de un tutor con alumnos asignados', async () => {
        // tutorConAlumnosId = tutorId;
        const res = await request(app)
            .delete(`/api/users/${tutorId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            'error',
            'No se puede eliminar el tutor porque tiene alumnos asignados. Elimine las relaciones primero.'
        );
    });



    test('Debería eliminar un alumno Mayor', async () => {
        const res = await request(app)
            .delete(`/api/users/${alumnoParaEliminarId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un alumno Menor', async () => {
        const res = await request(app)
            .delete(`/api/users/${alumnoMenorParaEliminarId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un tutor sin alumnos asignados', async () => {
        const res = await request(app)
            .delete(`/api/users/${tutorId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un admin', async () => {
        const res = await request(app)
            .delete(`/api/users/${adminId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });


    test('Debería devolver 404 al intentar eliminar un usuario inexistente', async () => {
        const res = await request(app).delete('/api/users/99999').set('Authorization', token);

        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'El usuario no existe o ya ha sido eliminado');
    });

})