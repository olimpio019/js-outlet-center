import express from 'express';
import {
  listarCategorias,
  buscarCategoria,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria
} from '../controllers/categoriaController';
import { autenticarJWT, apenasAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', listarCategorias);
router.get('/:id', buscarCategoria);

router.post('/', autenticarJWT, apenasAdmin, criarCategoria);
router.put('/:id', autenticarJWT, apenasAdmin, atualizarCategoria);
router.delete('/:id', autenticarJWT, apenasAdmin, deletarCategoria);

export default router;
