import { Router } from 'express';
import MateriaModel from '../../models/materia.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('materias');
});

router.get('/alta', async (req, res, next) => {
  try {
    res.render('alta-materia');
  } catch (error) {
    next(error);
  }
});


router.get('/baja', async (req, res, next) => {
  try {
    const materias = await MateriaModel.find({});
    res.render('eliminar-materias', { materias });
  } catch (error) {
    next(error);
  }
});


// Obtener todas las materias
router.get('/materias', async (req, res, next) => {
    try {
      const materias = await MateriaModel.find({});
      res.render('consultar-materias', { materias });
    } catch (error) {
      next(error);
    }
  });
  
  // Obtener una materia por ID
  router.get('/materias/:mid', async (req, res, next) => {
    try {
      const { params: { mid } } = req;
      const materia = await MateriaModel.findById(mid);
      if (!materia) {
        return res.status(404).json({ message: `Materia id ${mid} no encontrada.` });
      }
      res.status(200).json(materia);
    } catch (error) {
      next(error);
    }
  });
  
  // Crear una nueva materia
  router.post('/materias', async (req, res, next) => {
    try {
      const { body } = req;
      const materia = await MateriaModel.create(body);
      res.status(201).json(materia);
    } catch (error) {
      next(error);
    }
  });
  
  // Actualizar una materia
  router.put('/materias/:mid', async (req, res, next) => {
    try {
      const { body, params: { mid } } = req;
      await MateriaModel.updateOne({ _id: mid }, { $set: body });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
  // Eliminar una materia
  router.post('/baja/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const materia = await MateriaModel.findByIdAndDelete(id);
  
      if (!materia) {
        return res.status(404).render('error', { message: 'Materia no encontrada' });
      }
  
      res.redirect('/'); // Redirige de nuevo a la página de eliminar tareas
    } catch (error) {
      next(error);
    }
  });

  export default router;