import swaggerAutogen from 'swagger-autogen';

const outputFile = './src/swagger-output.json';
const endpointsFiles = ['./src/app.js'];

const doc = {
    info:
    {
        title: 'API de Academia',
        description: 'Documentación de la API de la Academia'
    },
    host: process.env.API_HOST || 'localhost:4000',
    schemes: ['http', 'https'],
}

swaggerAutogen()(outputFile, endpointsFiles, doc)