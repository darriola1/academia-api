USE academia_ingles;
-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES ('admin'), ('profesor'), ('alumno'), ('padre');

-- Insertar usuario con rol
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES ('Admin', 'Admin', 'admin@admin.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 1);

-- Insertar usuario con rol
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES ('Prueba', 'Denis', 'denis@admin.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 1);

INSERT INTO usuarios (id_usuario,nombre,apellido,email,password_hash,id_rol) 
														##password123
VALUES (3,'Denis','Arriola','darriola.dev@gmail.com','$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W',1);


-- Insetar datos de balance para un usuario
INSERT INTO balance (alumno_id, balance, updated)
VALUES (3,10,CURRENT_TIMESTAMP);

INSERT INTO clase (fecha, hora_inicio, hora_fin, profesora)
VALUES
    ('2024-12-01', '09:00:00', '10:30:00', 'María Pérez'),
    ('2024-12-02', '11:00:00', '12:30:00', 'Ana Rodríguez'),
    ('2024-12-03', '14:00:00', '15:30:00', 'Laura Fernández'),
    ('2024-12-04', '08:30:00', '10:00:00', 'Sofía López'),
    ('2024-12-05', '10:00:00', '11:30:00', 'Claudia Martínez'),
    ('2024-12-06', '13:00:00', '14:30:00', 'Carla Sánchez');
    
INSERT INTO alumnoClase (idClase, idAlumno, nivelCurso, asistio)
VALUES
    ( 1, 2,'Básico', TRUE),
    ( 2, 3,'Intermedio', FALSE),
    ( 3, 3,'Avanzado', TRUE),
    ( 1, 3,'Básico', FALSE),
    ( 1, 2,'Intermedio', TRUE),
    ( 2, 2,'Avanzado', FALSE);
    
-- Insertar usuarios con rol de alumno
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES 
('Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 3),
('Ana', 'García', 'ana.garcia@example.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 3);

-- Insertar alumnos relacionados con los usuarios
INSERT INTO alumnos (id_usuario, fecha_nacimiento, nivel_ingles)
VALUES 
(6, '2000-05-15', 'Intermedio'),
(7, '1991-06-22', 'Avanzado');

-- Insertar usuarios con rol de alumno
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES 
('Juan', 'Péasdasdrez', 'juan.pesdasdrez@example.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 3),
('Adasdna', 'García', 'ana.garasdascia@example.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 3);

-- Movimientos para Juan Pérez (alumno_id = 1)
INSERT INTO estado_cuenta (alumno_id, descripcion, monto, balance_final)
VALUES 
(1, 'Clase asistida', 20.00, 20.00),
(1, 'Pago realizado', -10.00, 10.00),
(1, 'Clase asistida', 20.00, 30.00);

-- Movimientos para Ana García (alumno_id = 2)
INSERT INTO estado_cuenta (alumno_id, descripcion, monto, balance_final)
VALUES 
(2, 'Clase asistida', 15.00, 15.00),
(2, 'Clase asistida', 15.00, 30.00),
(2, 'Pago realizado', -20.00, 10.00);

