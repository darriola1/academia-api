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

-- Insertar usuarios con rol de alumno
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES 
('Juan', 'Pérez', 'juan.perez@example.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 3),
('Ana', 'García', 'ana.garcia@example.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 3);

-- Insertar alumnos relacionados con los usuarios
INSERT INTO alumnos (id_usuario, fecha_nacimiento, nivel_ingles)
VALUES 
(4, '2000-05-15', 'Intermedio'),
(5, '1998-09-23', 'Avanzado');

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
