import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Iniciando busca de usuários na API...');
    
    const session = await getServerSession(authOptions);
    console.log('Sessão na API:', session);
    
    if (!session?.user?.admin) {
      console.log('Usuário não autorizado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('Buscando usuários no banco de dados...');
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        admin: true,
        criadoEm: true,
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    console.log('Usuários encontrados:', usuarios);
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 