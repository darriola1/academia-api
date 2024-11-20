USE academia_ingles;
-- Insertar roles
INSERT INTO roles (nombre_rol) VALUES ('admin'), ('profesor'), ('alumno'), ('padre');

-- Insertar usuario con rol
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES ('Admin', 'Admin', 'admin@admin.com', 'password123', 1);

-- Insertar usuario con rol
INSERT INTO usuarios (nombre, apellido, email, password_hash, id_rol)
VALUES ('Prueba', 'Denis', 'denis@admin.com', 'password123', 1);

INSERT INTO usuarios (id_usuario,nombre,apellido,email,password_hash,id_rol) 
VALUES (3,'Denis','Arriola','darriola.dev@gmail.com','$2b$10$46yv5D0DJ5JKRzgWtd5gouGmfSuYzHaz7tVSFz.SMTgrKUEuKMI9W',1);
