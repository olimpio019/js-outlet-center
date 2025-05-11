import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function listarProdutos(req: Request, res: Response) {
  const produtos = await prisma.produto.findMany({ include: { categoria: true } });
  res.json(produtos);
}

export async function buscarProduto(req: Request, res: Response) {
  const { id } = req.params;
  const produto = await prisma.produto.findUnique({ where: { id: Number(id) }, include: { categoria: true } });
  if (!produto) return res.status(404).json({ error: 'Produto não encontrado.' });
  res.json(produto);
}

export async function criarProduto(req: Request, res: Response) {
  const { nome, descricao, preco, imagemUrl, categoriaId, estoque } = req.body;
  if (!nome || !descricao || !preco || !imagemUrl || !categoriaId) {
    return res.status(400).json({ error: 'Dados obrigatórios faltando.' });
  }
  const novo = await prisma.produto.create({
    data: { nome, descricao, preco, imagemUrl, categoriaId: Number(categoriaId), estoque: estoque ?? 10 }
  });
  res.status(201).json(novo);
}

export async function atualizarProduto(req: Request, res: Response) {
  const { id } = req.params;
  const { nome, descricao, preco, imagemUrl, categoriaId, estoque } = req.body;
  const editado = await prisma.produto.update({
    where: { id: Number(id) },
    data: { nome, descricao, preco, imagemUrl, categoriaId: Number(categoriaId), estoque }
  });
  res.json(editado);
}

export async function deletarProduto(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.produto.delete({ where: { id: Number(id) } });
  res.status(204).end();
}
