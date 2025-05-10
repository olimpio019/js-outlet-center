import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_SYNCPAY_API_KEY;

    if (!apiKey) {
      console.error('API key não configurada');
      return NextResponse.json(
        { error: 'API key não configurada' },
        { status: 500 }
      );
    }

    console.log('API Key:', apiKey);
    console.log('Dados recebidos:', body);

    const syncpayBody = {
      amount: body.amount,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        cpf: body.customer.cpf,
        phone: body.customer.phone || '9999999999',
        address: {
          street: body.customer.address?.street || 'Rua Genérica',
          streetNumber: body.customer.address?.streetNumber || '123',
          complement: body.customer.address?.complement || 'Complemento',
          zipCode: body.customer.address?.zipCode || '00000000',
          neighborhood: body.customer.address?.neighborhood || 'Bairro',
          city: body.customer.address?.city || 'Cidade',
          state: body.customer.address?.state || 'SP',
          country: body.customer.address?.country || 'br',
        },
      },
      card: {
        number: body.card.number,
        holderName: body.card.name,
        expiryMonth: body.card.expiry.split('/')[0],
        expiryYear: body.card.expiry.split('/')[1],
        cvv: body.card.cvv,
      },
      items: body.items || [],
      postbackUrl: `${process.env.NEXTAUTH_URL}/api/credit-card/webhook`,
      traceable: true,
    };

    console.log('Enviando requisição para SyncPay:', {
      url: 'https://api.syncpay.pro/v1/gateway/api',
      body: syncpayBody,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const response = await fetch('https://api.syncpay.pro/v1/gateway/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(syncpayBody),
    });

    const responseText = await response.text();
    console.log('Resposta bruta do SyncPay:', responseText);

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('Erro ao parsear resposta:', e);
      return NextResponse.json(
        { error: 'Resposta inválida da API', details: e.message },
        { status: 500 }
      );
    }

    console.log('Resposta parseada do SyncPay:', responseData);

    if (!response.ok) {
      console.error('Erro na API do SyncPay:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      });
      return NextResponse.json(
        { 
          error: responseData.message || 'Erro ao processar pagamento com cartão',
          details: responseData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    );
  }
} 