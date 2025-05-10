import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('Notificação PIX recebida:', body);

    // Verifica se a notificação é válida
    if (!body.idTransaction || !body.status) {
      return NextResponse.json(
        { error: 'Notificação inválida' },
        { status: 400 }
      );
    }

    // Atualiza o status do pagamento no banco de dados
    const pagamento = await prisma.pagamento.update({
      where: {
        externalId: body.idTransaction,
      },
      data: {
        status: body.status === 'PAID' ? 'PAGO' : 'FALHOU',
        atualizadaEm: new Date(),
      },
      include: {
        pedido: true,
      },
    });

    // Se o pagamento foi confirmado, atualiza o status do pedido
    if (body.status === 'PAID' && pagamento.pedido) {
      await prisma.pedido.update({
        where: {
          id: pagamento.pedido.id,
        },
        data: {
          status: 'PAGO',
          atualizadoEm: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar callback PIX:', error);
    return NextResponse.json(
      { error: 'Erro ao processar notificação' },
      { status: 500 }
    );
  }
} 