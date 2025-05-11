import { PrismaClient, PedidoStatus } from '@prisma/client';
import type { AuthRequest } from '../middlewares/auth';
import { Request, type Response } from 'express';

const prisma = new PrismaClient();

export async function criarPedido(req: AuthRequest, res: Response) {
  const usuarioId = req.user.id;
  const { itens, enderecoId } = req.body;
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({ error: 'Itens do pedido obrigatórios.' });
  }
  if (!enderecoId) {
    return res.status(400).json({ error: 'Endereço obrigatório.' });
  }
  // Calcula total
  let total = 0;
  for (const item of itens) {
    const prod = await prisma.produto.findUnique({ where: { id: item.produtoId } });
    if (!prod) return res.status(400).json({ error: 'Produto não encontrado: ' + item.produtoId });
    total += Number(prod.preco) * (item.quantidade || 1);
  }

  const pedido = await prisma.pedido.create({
    data: {
      usuarioId,
      enderecoId,
      total,
      status: 'PENDENTE',
      itens: {
        create: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade || 1 }))
      }
    },
    include: { itens: true, endereco: true }
  });
  res.status(201).json(pedido);
}

export async function listarPedidos(req: AuthRequest, res: Response) {
  const admin = req.user.admin;
  const where = admin ? {} : { usuarioId: req.user.id };
  const pedidos = await prisma.pedido.findMany({
    where,
    include: { itens: { include: { produto: true } }, endereco: true, pagamento: true, usuario: true }
  });
  res.json(pedidos);
}

export async function detalhePedido(req: AuthRequest, res: Response) {
  const admin = req.user.admin;
  const id = Number(req.params.id);
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: { itens: { include: { produto: true } }, endereco: true, pagamento: true, usuario: true }
  });
  if (!pedido) return res.status(404).json({ error: 'Pedido não encontrado.' });
  if (!admin && pedido.usuarioId !== req.user.id) {
    return res.status(403).json({ error: 'Sem permissão.' });
  }
  res.json(pedido);
}

export async function atualizarStatusPedido(req: AuthRequest, res: Response) {
  const id = Number(req.params.id);
  const { status } = req.body;
  if (!['ENVIADO', 'CANCELADO'].includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' });
  }
  const pedido = await prisma.pedido.update({
    where: { id },
    data: { status },
    include: { itens: true, endereco: true, pagamento: true, usuario: true }
  });
  res.json(pedido);
}
