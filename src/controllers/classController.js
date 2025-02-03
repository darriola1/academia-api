import { ClasesModel } from "../models/classModel.js";
import logger from '../logger.js';


export class ClassController {

    static async getAllClasses(req, res) {

        try {

            const clases = await ClasesModel.obtenerClases();
            res.status(200).json(clases);

          } catch (error) {

            console.error(error.message);
            res.status(500).json({ error: "Error al obtener las clases" });

          }
    }

    static async getClassById(req, res) {

      try {
          const { id } = req.params;

          if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "El ID debe ser un número mayor a 0" });
          }

          const clases = await ClasesModel.obtenerClasePorId(id);

          if (!clases || clases.length === 0) {
            return res.status(404).json({ error: `No se encontró una clase con el ID ${id}` });
          }

          res.status(200).json(clases);

        } catch (error) {

          console.error(error.message);
          res.status(500).json({ error: "Error al obtener la clase" });

        }
  }

  static async getClassByDates(req, res) {

    try {
      const { fechaInicio, fechaFin } = req.body;
      
      // Validar que ambas fechas estén presentes
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ error: "tiene que ingresar una fecha de inicio y una fecha de fin" });
      }

      // Validar que fechaInicio sea menor que fechaFin
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        return res.status(400).json({ error: "Las fechas deben tener un formato válido (YYYY-MM-DD)" });
      }

      if (inicio >= fin) {
        return res.status(400).json({ error: "la fecha de inicio tiene que ser menor a la fecha de fin" });
      }

      const clasesPorFecha = await ClasesModel.getClassesByDate(fechaInicio, fechaFin);

      res.status(200).json(clasesPorFecha);

    } catch (error) {

      console.error(`[ClassController] Error: ${error.message}`);
      res.status(500).json({ error: "Error al obtener las clases" });

    }
  }

  static async getClassByStudent(req, res) {

    try {
      const { id} = req.body;
      
      // Validar que el ID esté presente, sea un número y mayor a 0
      if (!id || isNaN(id) || id <= 0) {
        return res.status(400).json({ error: "El ID debe ser un número mayor a 0" });
      }

      // Validar que el alumno exista
      const alumnoExiste = await ClasesModel.existeAlumnoPorId(id);
      if (alumnoExiste.length === 0) {
        return res.status(404).json({ error: `No se encontró un alumno con el ID ${id}` });
      }

      const clasesPorAlumno = await ClasesModel.getClassesByStudent(id);
      
      res.status(200).json(clasesPorAlumno);

    } catch (error) {

      console.error(`[ClassController] Error: ${error.message}`);
      res.status(500).json({ error: "Error al obtener las clases" });

    }
  }

  static async newClass(req, res) {

    try {
      const {fecha, horaInicio, horaFin, profesora } = req.body;

      // Validar que todos los parámetros estén presentes
      if (!fecha || !horaInicio || !horaFin || !profesora) {
        return res.status(400).json({ error: "Todos los campos (fecha, horaInicio, horaFin, profesora) son requeridos" });
      }

      // Validar que la fecha tenga el formato correcto (YYYY-MM-DD)
      const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!fechaRegex.test(fecha)) {
        return res.status(400).json({ error: "La fecha debe tener el formato YYYY-MM-DD" });
      }

      // Validar que la hora de inicio sea menor a la hora de fin
      if (Number(horaInicio) >= Number(horaFin)) {
        return res.status(400).json({ error: "horaInicio debe ser menor que horaFin" });
      }

      const claseNueva = await ClasesModel.newClass(fecha, horaInicio, horaFin, profesora );
      res.status(200).json(claseNueva);

    } catch (error) {

      console.error(`[ClassController] Error: ${error.message}`);
      res.status(500).json({ error: "Error al crear la clase" });

    }
  }

  static async deleteClass(req, res) {

    try {
      const {id } = req.body;
      const deleteClass = await ClasesModel.deleteClass(id);
      res.status(200).json(deleteClass);

    } catch (error) {

      console.error(`[ClassController] Error: ${error.message}`);
      res.status(500).json({ error: "Error al borrar la clase" });

    }
  }

  static async editClass(req, res) {

    const { id,fecha, hora_inicio, hora_fin, profesora } = req.body;

  
    if (!id || !fecha || !hora_inicio || !hora_fin || !profesora) {
    return res.status(400).json({ error: "Todos los campos  son requeridos" });
  }
    try {
      
      const editedClass = await ClasesModel.editClass(id,fecha, hora_inicio, hora_fin, profesora);
      res.status(200).json(editedClass);

    } catch (error) {

      console.error(`[ClassController] Error: ${error.message}`);
      res.status(500).json({ error: "Error al borrar la clase" });

    }
  }

  static async addStudentClass(req, res) {

    const { idClase, idAlumno,nivel} = req.body;

    try {
      
      const addStudent = await ClasesModel.addStudent(idClase, idAlumno,nivel );
      res.status(200).json(addStudent);

    } catch (error) {

      console.error(`[ClassController] Error: ${error.message}`);
      res.status(500).json({ error: "Error al agregar alumno" });

    }
  }
}



