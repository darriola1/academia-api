-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS academia_ingles;
USE academia_ingles;

-- Crear tabla de roles
CREATE TABLE roles (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE
);

-- Crear tabla de usuarios con campo "activo"
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INT,
    telefono VARCHAR(15),
    activo BOOLEAN NOT NULL DEFAULT TRUE, -- Campo para desactivar usuarios sin eliminarlos
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

-- Crear tabla de alumnos con nivel_ingles como ENUM
CREATE TABLE alumnos (
    id_alumno INT PRIMARY KEY,
    fecha_nacimiento DATE NOT NULL,
    nivel_ingles ENUM(
        'children-1', 
        'children-2', 
        'children-3',
        'juniors-1',
        'juniors-2',
        'juniors-3',
        'juniors-4',
        'Ket',
        'Pet',
        'First',
        'adultos-1'
    ) NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Crear tabla de relación alumno-padre
CREATE TABLE relacion_alumno_padre (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_alumno INT NOT NULL,
    id_padre INT NOT NULL,
    FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno) ON DELETE CASCADE,
    FOREIGN KEY (id_padre) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Crear tabla de profesores
CREATE TABLE profesores (
    id_profesor INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Crear tabla de clases con referencia a profesores
CREATE TABLE clase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_profesor INT NOT NULL,
    FOREIGN KEY (id_profesor) REFERENCES profesores(id_profesor) ON DELETE CASCADE
);

-- Crear tabla alumnoClase con índice compuesto para evitar duplicados
CREATE TABLE alumnoClase (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idClase INT NOT NULL,
    idAlumno INT NOT NULL,
    nivelCurso VARCHAR(50) NOT NULL,
    asistio BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (idClase) REFERENCES clase(id) ON DELETE CASCADE,
    FOREIGN KEY (idAlumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    UNIQUE KEY (idClase, idAlumno) -- Índice compuesto
);

-- Crear tabla de asistencia
CREATE TABLE asistencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    clase_dia DATE NOT NULL,
    clase_hora TIME NOT NULL,
    status ENUM('attended', 'missed') DEFAULT 'missed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES usuarios(id_usuario)
);

-- Crear tabla de estado de cuenta con tipo_movimiento como ENUM
CREATE TABLE estado_cuenta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10, 2) NOT NULL, -- Positivo o negativo según el movimiento
    balance_final DECIMAL(10, 2) NOT NULL, -- Balance tras este movimiento
    tipo_movimiento ENUM('factura', 'ingreso') NOT NULL, -- Tipos definidos
    FOREIGN KEY (alumno_id) REFERENCES usuarios(id_usuario)
);
