import express from 'express';
import { autenticarJWT } from '../middlewares/auth';
import { criarPagamento, webhookPagamento } from '../controllers/pagamentoController';

const router = express.Router();

router.post('/', autenticarJWT, criarPagamento);
router.post('/webhook', webhookPagamento);

export default router;
