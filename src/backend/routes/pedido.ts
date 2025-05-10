import express from 'express';
import { autenticarJWT, apenasAdmin } from '../middlewares/auth';
import {
  criarPedido,
  listarPedidos,
  detalhePedido,
  atualizarStatusPedido,
} from '../controllers/pedidoController';

const router = express.Router();

router.post('/', autenticarJWT, criarPedido);
router.get('/', autenticarJWT, listarPedidos);
router.get('/:id', autenticarJWT, detalhePedido);
router.put('/:id/status', autenticarJWT, apenasAdmin, atualizarStatusPedido);

export default router;
