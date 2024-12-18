CREATE DATABASE academia_ingles;
USE academia_ingles;

CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE alumnos (
    id_alumno INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    fecha_nacimiento DATE,
    nivel_ingles VARCHAR(50),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE padres (
    id_padre INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    telefono VARCHAR(15),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE relacion_alumno_padre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_alumno INT NOT NULL,
    id_padre INT NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno),
    FOREIGN KEY (id_padre) REFERENCES padres(id_padre)
);

CREATE TABLE asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    clase_dia DATE NOT NULL,
    clase_hora TIME NOT NULL,
    status ENUM('attended', 'missed') DEFAULT 'missed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES usuarios(id_usuario)
);

CREATE TABLE estado_cuenta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL, -- Positivo o negativo según el movimiento
    balance_final DECIMAL(10, 2) NOT NULL, -- Balance tras este movimiento
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id_alumno)
);