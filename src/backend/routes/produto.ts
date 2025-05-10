import express from 'express';
import {
  listarProdutos,
  buscarProduto,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from '../controllers/produtoController';
import { autenticarJWT, apenasAdmin } from '../middlewares/auth';

const router = express.Router();

router.get('/', listarProdutos);
router.get('/:id', buscarProduto);

router.post('/', autenticarJWT, apenasAdmin, criarProduto);
router.put('/:id', autenticarJWT, apenasAdmin, atualizarProduto);
router.delete('/:id', autenticarJWT, apenasAdmin, deletarProduto);

export default router;
