import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/admin/produtos/[id] - Buscar um produto específico
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Iniciando busca do produto:', params.id);
    
    const session = await getServerSession(authOptions);
    console.log('Sessão:', session);

    if (!session || session.user.role !== 'ADMIN') {
      console.log('Usuário não autorizado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      console.log('ID inválido:', params.id);
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      );
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id: id,
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
          },
        },
      },
    });

    console.log('Produto encontrado:', produto);

    if (!produto) {
      console.log('Produto não encontrado');
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro detalhado ao buscar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/produtos/[id] - Atualizar um produto
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const produto = await prisma.produto.update({
      where: { id: parseInt(params.id) },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        imagemUrl: data.imagemUrl,
        estoque: data.estoque,
        categoriaId: data.categoriaId,
      },
      include: {
        categoria: {
          select: {
            nome: true,
          },
        },
      },
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/produtos/[id] - Deletar um produto
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      );
    }

    await prisma.produto.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/produtos/[id] - Atualizar parcialmente um produto
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID do produto inválido' },
        { status: 400 }
      );
    }

    const produto = await prisma.produto.update({
      where: { id },
      data,
      include: {
        categoria: {
          select: {
            nome: true,
          },
        },
      },
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 