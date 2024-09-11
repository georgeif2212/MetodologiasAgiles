import { Router } from 'express';
import TareaModel from '../../models/tarea.model.js';
import MateriaModel from '../../models/materia.model.js'; 

const router = Router();

router.get('/', (req, res) => {
  res.render('tareas'); // Renderiza la vista de tareas
});

router.get('/asignar-materia', async (req, res, next) => {
  try {
    const materias = await MateriaModel.find({});
    res.render('asignar-materia', { materias });
  } catch (error) {
    next(error);
  }
});

router.get('/alta', async (req, res, next) => {
  try {
    res.render('alta-tarea');
  } catch (error) {
    next(error);
  }
});


// Obtener todas las tareas
router.get('/tareas', async (req, res, next) => {
  try {
    const tareas = await TareaModel.find({}).populate('materia');
    res.status(200).json(tareas);
  } catch (error) {
    next(error);
  }
});

// Obtener una tarea por ID
router.get('/tareas/:tid', async (req, res, next) => {
  try {
    const { params: { tid } } = req;
    const tarea = await TareaModel.findById(tid).populate('materia');
    if (!tarea) {
      return res.status(404).json({ message: `Tarea id ${tid} no encontrada.` });
    }
    res.status(200).json(tarea);
  } catch (error) {
    next(error);
  }
});

// Crear una nueva tarea
router.post('/tareas', async (req, res, next) => {
  try {
    const { body } = req;
    // Si no se proporciona una materia, no la incluimos en el objeto
    if (!body.materia) {
      delete body.materia;
    }
    const tarea = await TareaModel.create(body);
    res.status(201).json(tarea);
  } catch (error) {
    next(error);
  }
});

// Actualizar una tarea
router.put('/tareas/:tid', async (req, res, next) => {
  try {
    const { body, params: { tid } } = req;
    
    // Si se proporciona un nombre de materia, buscamos la materia por su nombre
    if (body.nombreMateria) {
      const materia = await MateriaModel.findOne({ nombre: body.nombreMateria });
      if (materia) {
        body.materia = materia._id; // Asignamos el ID de la materia encontrada
      } else {
        return res.status(404).json({ message: `Materia "${body.nombreMateria}" no encontrada.` });
      }
      delete body.nombreMateria; // Eliminamos el campo nombreMateria del body
    }

    const tareaActualizada = await TareaModel.findByIdAndUpdate(tid, body, { new: true });
    
    if (!tareaActualizada) {
      return res.status(404).json({ message: `Tarea con id ${tid} no encontrada.` });
    }

    res.status(200).json(tareaActualizada);
  } catch (error) {
    next(error);
  }
});

// Eliminar una tarea
router.delete('/tareas/:tid', async (req, res, next) => {
  try {
    const { params: { tid } } = req;
    await TareaModel.deleteOne({ _id: tid });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.post('/asignar-materia', async (req, res, next) => {
  try {
    const { tareaId, materiaId } = req.body;
    
    const tarea = await TareaModel.findById(tareaId);
    if (!tarea) {
      return res.status(404).render('error', { message: 'Tarea no encontrada' });
    }

    const materia = await MateriaModel.findById(materiaId);
    if (!materia) {
      return res.status(404).render('error', { message: 'Materia no encontrada' });
    }

    tarea.materia = materiaId;
    await tarea.save();

    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

export default router;
