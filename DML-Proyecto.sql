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
VALUES (3,10,CURRENT_TIMESTAMP)