import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import produtoRouter from './routes/produto';
import categoriaRouter from './routes/categoria';
import pedidoRouter from './routes/pedido';
import pagamentoRouter from './routes/pagamento';

// Carregar variáveis .env
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.API_PORT || 3333;

app.use(cors());
app.use(express.json());

// Usar rotas de autenticação
app.use('/auth', authRouter);

// Usar rotas de produtos e categorias
app.use('/produtos', produtoRouter);
app.use('/categorias', categoriaRouter);

// Usar rotas de pedidos e pagamentos
app.use('/pedidos', pedidoRouter);
app.use('/pagamentos', pagamentoRouter);

// Status root
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'E-commerce API online' });
});

app.listen(PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${PORT}`);
});
