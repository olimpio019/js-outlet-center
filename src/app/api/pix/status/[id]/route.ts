import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_EVOPAY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://pix.evopay.cash/v1/pix?id=${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Erro ao verificar status do pagamento' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 