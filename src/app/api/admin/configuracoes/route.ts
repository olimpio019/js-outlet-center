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

    const configuracoes = await prisma.configuracao.findFirst();

    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.admin) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const configuracoes = await prisma.configuracao.upsert({
      where: { id: 1 },
      update: {
        nomeLoja: data.nomeLoja,
        emailContato: data.emailContato,
        telefoneContato: data.telefoneContato,
        enderecoLoja: data.enderecoLoja,
        chavePix: data.chavePix,
        taxaEntrega: parseFloat(data.taxaEntrega),
        prazoEntrega: parseInt(data.prazoEntrega),
        horarioFuncionamento: data.horarioFuncionamento,
      },
      create: {
        id: 1,
        nomeLoja: data.nomeLoja,
        emailContato: data.emailContato,
        telefoneContato: data.telefoneContato,
        enderecoLoja: data.enderecoLoja,
        chavePix: data.chavePix,
        taxaEntrega: parseFloat(data.taxaEntrega),
        prazoEntrega: parseInt(data.prazoEntrega),
        horarioFuncionamento: data.horarioFuncionamento,
      },
    });

    return NextResponse.json(configuracoes);
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 