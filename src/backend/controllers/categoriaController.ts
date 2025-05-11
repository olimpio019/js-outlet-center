import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function listarCategorias(req: Request, res: Response) {
  const categorias = await prisma.categoria.findMany();
  res.json(categorias);
}

export async function buscarCategoria(req: Request, res: Response) {
  const { id } = req.params;
  const categoria = await prisma.categoria.findUnique({ where: { id: Number(id) } });
  if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada.' });
  res.json(categoria);
}

export async function criarCategoria(req: Request, res: Response) {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Nome obrigatório.' });
  }
  const nova = await prisma.categoria.create({ data: { nome } });
  res.status(201).json(nova);
}

export async function atualizarCategoria(req: Request, res: Response) {
  const { id } = req.params;
  const { nome } = req.body;
  const editada = await prisma.categoria.update({ where: { id: Number(id) }, data: { nome } });
  res.json(editada);
}

export async function deletarCategoria(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.categoria.delete({ where: { id: Number(id) } });
  res.status(204).end();
}
