-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES ('admin'), ('profesor'), ('alumno'), ('padre');

-- Insertar usuario con rol
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES ('Admin', 'Admin', 'admin@admin.com', 'password123', 1);
