import pool from '../config/db.js';
import logger from '../logger.js';

export class ClasesModel {

    static async obtenerClases(){

        try {

            const [classes] = await pool.query(
              "SELECT id, name, date FROM classes ORDER BY date ASC"
            );
            return classes;

          } catch (error) {

            throw new Error("Error al obtener las clases: " + error.message);

          }
    }

    static async obtenerClasePorId(id){

      try {

          const [classes] = await pool.query(
            "SELECT id, name, date FROM classes WHERE id = ?", [id]
          );
          return classes;

        } catch (error) {

          throw new Error("Error al obtener las clases: " + error.message);

        }
  }

  static async getClassesByDate(fechaInicio, fechaFin){

    try {

        const [clases] = await pool.query(
          "SELECT id, name, date FROM classes WHERE date BETWEEN ? AND ? ORDER BY date ASC",
          [fechaInicio, fechaFin]
        );
        return clases;

      } catch (error) {

        throw new Error("Error al obtener las clases: " + error.message);

      }
}

static async getClassesByStudent(idAlumno){

  try {
    
      const [clases] = await pool.query(
        `SELECT c.id, c.fecha, c.profesora
       FROM clase c
       JOIN alumnoClase ac ON c.id = ac.idClase
       WHERE ac.idAlumno = ?
       ORDER BY c.fecha ASC`,
      [idAlumno]
      );
      
      return clases;

    } catch (error) {

      throw new Error("Error al obtener las clases: " + error.message);

    }
}

static async newClass(fecha, horaInicio, horaFin, profesora){

  try {
    
      const [claseNueva] = await pool.query(
        "INSERT INTO clase (fecha, hora_inicio, hora_fin, profesora) VALUES (?, ?, ?, ?)",
        [fecha, horaInicio, horaFin, profesora]
      );
      
      return claseNueva;

    } catch (error) {

      throw new Error("Error al obtener las clases: " + error.message);

    }
}

static async deleteClass(id){

  try {
    
      const [borrarClase] = await pool.query(
        "DELETE FROM clase WHERE id = ?", [id]
      );
      
      return borrarClase;

    } catch (error) {

      throw new Error("Error al borrar la clase: " + error.message);

    }
}

static async editClass(id,fecha, hora_inicio, hora_fin, profesora){

  try {
    
      const [editarClase] = await pool.query(
        `UPDATE clase 
        SET fecha = ?, hora_inicio = ?, hora_fin = ?, profesora = ? 
        WHERE id = ?`,
      [fecha, hora_inicio, hora_fin, profesora, id]
      );
      
      return editarClase;

    } catch (error) {

      throw new Error("Error al borrar la clase: " + error.message);

    }
}

static async addStudent(idClase,idAlumno,nivel){

  try {
    
      const [agregarEstudiante] = await pool.query(
         "INSERT INTO alumnoclase (idclase, idalumno,nivelCurso,asistio) VALUES (?, ?, ?,0)",
      [idClase,idAlumno,nivel]
      );
      
      return agregarEstudiante;

    } catch (error) {

      throw new Error("Error al agregar el alumno: " + error.message);

    }
}

static async existeAlumnoPorId(idAlumno) {
  try {
    const [result] = await pool.query(
      "SELECT id_alumno FROM alumnos WHERE id_alumno = ?", [idAlumno]
    );
    return result
  } catch (error) {
    throw new Error("Error al verificar la existencia del alumno: " + error.message);
  }
}

    
};


