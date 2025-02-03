import request from 'supertest';
import app from '../src/app.js';

describe('Pruebas para app.js', () => {
    test('Debería devolver 200 en la ruta /health', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('API is healthy');
    });

    test('Debería devolver 404 para rutas no definidas', async () => {
        const rutaRandom = `ruta${Date.now()}`
        const res = await request(app).get(`/${rutaRandom}`);
        expect(res.statusCode).toBe(404);
        expect(res.text).toBe('End Point no valido');
    });
});
