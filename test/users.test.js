import request from 'supertest';
import app from '../src/app.js';
import dotenv from 'dotenv';
dotenv.config();

let token;
let tutorId;

let tutorConAlumnosId;
let tutorSinAlumnosId;
let alumnoParaEliminarId;


beforeAll(async () => {
    // Obtener un token válido
    const res = await request(app).post('/api/login').send({
        email: 'darriola.dev@gmail.com',
        password: 'password123',
    });
    token = `Bearer ${res.body.token}`;

    // Crear un tutor con alumnos asignados
    const tutorConAlumnosRes = await request(app)
        .post('/api/users/tutor')
        .set('Authorization', token)
        .send({
            nombre: 'TutorConAlumnos',
            apellido: 'Prueba',
            email: `tutorConAlumnos${Date.now()}@example.com`,
            password: 'password123',
            telefono: '099123456',
        });
    tutorConAlumnosId = tutorConAlumnosRes.body.idUsuario;

    // Crear un alumno asignado a este tutor
    const alumnoRes = await request(app)
        .post('/api/users/alumno')
        .set('Authorization', token)
        .send({
            nombre: 'AlumnoAsignado',
            apellido: 'Prueba',
            email: `alumnoAsignado${Date.now()}@example.com`,
            password: 'password123',
            fechaNacimiento: '2010-04-01',
            nivelIngles: 'Intermedio',
            tutorId: tutorConAlumnosId,
        });

    // Crear un tutor sin alumnos asignados
    const tutorSinAlumnosRes = await request(app)
        .post('/api/users/tutor')
        .set('Authorization', token)
        .send({
            nombre: 'TutorSinAlumnos',
            apellido: 'Prueba',
            email: `tutorSinAlumnos${Date.now()}@example.com`,
            password: 'password123',
            telefono: '099987654',
        });
    tutorSinAlumnosId = tutorSinAlumnosRes.body.idUsuario;

    // Crear un alumno que pueda ser eliminado
    const alumnoParaEliminarRes = await request(app)
        .post('/api/users/alumno')
        .set('Authorization', token)
        .send({
            nombre: 'AlumnoParaEliminar',
            apellido: 'Prueba',
            email: `alumnoParaEliminar${Date.now()}@example.com`,
            password: 'password123',
            fechaNacimiento: '2000-01-01',
            nivelIngles: 'Básico',
        });
    alumnoParaEliminarId = alumnoParaEliminarRes.body.idUsuario;
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

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Administrador creado correctamente');
        expect(res.body).toHaveProperty('idUsuario');
    });

});

describe('Metodos para obtener usuarios', () => {

    test('Debería devolver 404 si no hay tutores registrados', async () => {
        const res = await request(app).get('/api/users/tutores').set('Authorization', token);
        console.log('res: ', res)
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'No se encontraron tutores registrados');
    });

    test('Debería devolver la lista de tutores registrados', async () => {
        const res = await request(app).get('/api/users/tutores').set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

});

describe('Actualizacion de datos de usuarios', () => {
    test('Debería actualizar un usuario existente', async () => {
        const res = await request(app)
            .put('/api/users/1') // Asume que el usuario con ID 1 existe
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
        const idRandom = 150 + (Math.floor(Math.random() * 99) + 1);
        console.log(`/api/users/${idRandom}`)

        const res = await request(app).delete(`/api/users/${idRandom}`).set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería rechazar la eliminación de un tutor con alumnos asignados', async () => {
        const res = await request(app)
            .delete(`/api/users/${tutorConAlumnosId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty(
            'error',
            'No se puede eliminar el tutor porque tiene alumnos asignados. Elimine las relaciones primero.'
        );
    });

    test('Debería eliminar un tutor sin alumnos asignados', async () => {
        const res = await request(app)
            .delete(`/api/users/${tutorSinAlumnosId}`)
            .set('Authorization', token);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Usuario eliminado correctamente');
    });

    test('Debería eliminar un alumno', async () => {
        const res = await request(app)
            .delete(`/api/users/${alumnoParaEliminarId}`)
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