import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const pedidos = await prisma.pedido.findMany({
      include: {
        usuario: {
          select: {
            nome: true,
            email: true,
          },
        },
        itens: {
          include: {
            produto: {
              select: {
                nome: true,
                preco: true,
                imagemUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    return NextResponse.json(pedidos);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 