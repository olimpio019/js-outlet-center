import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_EVOPAY_API_KEY;

    if (!apiKey) {
      console.error('API key não configurada no servidor');
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    console.log('Enviando requisição para EvoPay:', {
      url: 'https://pix.evopay.cash/v1/pix',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey ? 'Configurada' : 'Não configurada'
      }
    });

    const response = await fetch('https://pix.evopay.cash/v1/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Resposta do EvoPay:', {
      status: response.status,
      statusText: response.statusText,
      data: data
    });

    if (!response.ok) {
      console.error('Erro na resposta do EvoPay:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      return NextResponse.json(
        { error: data.message || 'Erro ao criar pagamento PIX' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
} 