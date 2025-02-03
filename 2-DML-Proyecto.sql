INSERT INTO roles (nombre_rol) VALUES
('admin'),
('profesor'),
('alumno'),
('padre');


INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol, telefono, activo) VALUES
('Admin', 'User', 'admin@academia.com', '$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W', 1, '099111111', TRUE),
('Maria', 'Lopez', 'profesora1@academia.com', '$2b$10$hashProfesor1', 2, '099222222', TRUE),
('Juan', 'Perez', 'padre1@academia.com', '$2b$10$hashPadre1', 4, '099333333', TRUE),
('Lucia', 'Garcia', 'alumna1@academia.com', '$2b$10$hashAlumno1', 3, '099444444', TRUE),
('Carlos', 'Sosa', 'alumno2@academia.com', '$2b$10$hashAlumno2', 3, '099555555', TRUE);


INSERT INTO profesores (id_usuario) VALUES
(2); -- id_usuario corresponde a Maria Lopez


INSERT INTO alumnos (id_alumno, fecha_nacimiento, nivel_ingles) VALUES
(4, '2010-01-26', 'juniors-3'), -- id_alumno corresponde a Lucia Garcia
(5, '2012-06-15', 'children-2'); -- id_alumno corresponde a Carlos Sosa


INSERT INTO relacion_alumno_padre (id_alumno, id_padre) VALUES
(4, 3), -- Lucia Garcia con Juan Perez
(5, 3); -- Carlos Sosa con Juan Perez

INSERT INTO clase (fecha, hora_inicio, hora_fin, id_profesor) VALUES
('2025-02-01', '10:00:00', '11:00:00', 1), -- Clase con Maria Lopez
('2025-02-02', '15:00:00', '16:30:00', 1); -- Clase con Maria Lopez

INSERT INTO alumnoClase (idClase, idAlumno, nivelCurso, asistio) VALUES
(1, 4, 'juniors-3', TRUE), -- Lucia asistió a la primera clase
(2, 5, 'children-2', FALSE); -- Carlos no asistió a la segunda clase


INSERT INTO estado_cuenta (alumno_id, descripcion, monto, balance_final, tipo_movimiento) VALUES
(4, 'Pago de cuota mensual', 50.00, 100.00, 'ingreso'), -- Lucia
(5, 'Pago de material', 30.00, 50.00, 'ingreso'), -- Carlos
(5, 'Factura de clase particular', -25.00, 25.00, 'factura'); -- Carlos

INSERT INTO asistencia (alumno_id, clase_dia, clase_hora, status) VALUES
(4, '2025-02-01', '10:00:00', 'attended'), -- Lucia asistió
(5, '2025-02-02', '15:00:00', 'missed'); -- Carlos no asistió

