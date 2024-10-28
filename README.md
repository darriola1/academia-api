# 📚 Proyecto Academia de Inglés

Bienvenido a la plataforma de gestión para la Academia de Inglés. Este proyecto permite gestionar usuarios, autenticación y otros módulos específicos de la administración de una academia de idiomas.

## 🚀 Ejecución del Proyecto con Docker

Sigue estos pasos para levantar la aplicación y la base de datos en un entorno Dockerizado.

### ✅ Prerrequisitos

Asegúrate de tener instalados los siguientes programas:

- 🐳 [Docker](https://www.docker.com/)
- 📦 Docker Compose

### ⚙️ 1. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con la configuración de conexión a la base de datos y otros valores necesarios. Usa el siguiente formato:

dotenv

Copiar código

`DB_HOST=db
DB_USER=root
DB_PASSWORD=AdminDB
DB_NAME=academia_ingles
JWT_SECRET=supersecretkey`

### 🛠️ 2. Construir e Iniciar los Contenedores

En la raíz del proyecto, ejecuta el siguiente comando para construir e iniciar los contenedores:

bash

Copiar código

`docker-compose up --build`

Este comando:

- Construirá la imagen de Docker para la API de Node.js.
- Iniciará los servicios definidos en `docker-compose.yml` (API de Node.js y base de datos MySQL).

### 🔍 3. Verificar el Inicio del Servidor

Una vez que los contenedores estén en ejecución, deberías ver el siguiente mensaje en la terminal, indicando que el servidor está activo:

arduino

Copiar código

`Server running on port 3000`

### 🔗 4. Probar el Endpoint para Obtener Usuarios

Para asegurarte de que el sistema se está conectando correctamente a la base de datos, prueba el siguiente endpoint:

- **Endpoint**: `GET /api/users`
- **URL**: `http://localhost:3000/api/users`

Puedes hacer esta solicitud usando una herramienta como **Postman** o **curl** en la terminal:

bash

Copiar código

`curl http://localhost:3000/api/users`

Si la conexión a la base de datos es correcta, deberías recibir un JSON con la lista de usuarios o un array vacío si aún no hay datos en la tabla.

### 🐞 Solución de Problemas Comunes

- ⚠️ **Error de conexión a la base de datos**: Asegúrate de que el valor de `DB_HOST` en `.env` sea `db`, y verifica que las credenciales de usuario y contraseña coincidan con las definidas en `docker-compose.yml`.
- ⚠️ **Puerto en uso**: Si el puerto `3000` o `3307` ya está en uso, ajusta los valores en `docker-compose.yml` o libera esos puertos.
