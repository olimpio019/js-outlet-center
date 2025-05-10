import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { nome, email, senha } = await request.json();
    if (!nome || !email || !senha) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando.' }, { status: 400 });
    }
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 400 });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao registrar usuário.' }, { status: 500 });
  }
} 