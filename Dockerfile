# 1. Usar la imagen base de Node.js
FROM node:20.12.0

# 2. Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# 3. Copiar el package.json y package-lock.json al contenedor
COPY package*.json ./

# 4. Instalar las dependencias
RUN npm install

# 5. Copiar el resto de los archivos de la app
COPY . .

# 6. Exponer el puerto que usará el servidor (ajusta si usas otro puerto en el servidor)
EXPOSE 3000

# 7. Comando para ejecutar el servidor
CMD ["npm", "start"]
