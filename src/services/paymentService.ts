import { toast } from 'react-hot-toast';

interface PaymentData {
  amount: number;
  customer: {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
    address?: {
      street?: string;
      streetNumber?: string;
      complement?: string;
      zipCode?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      country?: string;
    };
  };
  items?: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
    tangible: boolean;
  }>;
  postbackUrl: string;
  pix?: {
    expiresInDays?: number;
  };
  traceable?: boolean;
  metadata?: string;
}

interface CreditCardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface PixPaymentResponse {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
  amount: number;
  taxAmount: number;
  amountWithTax: number;
  qrCodeText: string;
  qrCodeBase64: string;
  qrCodeUrl: string;
  payerName?: string;
  payerCPF?: string;
}

interface CreditCardPaymentResponse {
  status: string;
  message: string;
  transactionId: string;
}

class PaymentService {
  private apiKey: string;
  private baseUrl: string;
  private readonly MIN_AMOUNT = 1.49;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_EVOPAY_API_KEY || '';
    this.baseUrl = 'https://pix.evopay.cash/v1';
    console.log('PaymentService inicializado com API Key:', this.apiKey);
    if (!this.apiKey) {
      console.error('API Key não encontrada nas variáveis de ambiente');
    }
  }

  async createPixPayment(paymentData: PaymentData): Promise<PixPaymentResponse> {
    try {
      const amount = parseFloat(Number(paymentData.amount).toFixed(2));
      
      if (amount < this.MIN_AMOUNT) {
        throw new Error(`O valor mínimo para pagamento PIX é R$ ${this.MIN_AMOUNT}`);
      }

      if (!this.apiKey) {
        throw new Error('API key não configurada');
      }

      const formattedPaymentData = {
        amount: amount,
        callbackUrl: paymentData.postbackUrl,
        payerName: paymentData.customer.name,
        payerDocument: paymentData.customer.cpf,
        payerEmail: paymentData.customer.email
      };

      console.log('Enviando dados para criação do PIX:', formattedPaymentData);

      const response = await fetch('/api/pix/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedPaymentData),
      });

      const responseData = await response.json();
      console.log('Resposta da API:', responseData);

      if (!response.ok) {
        console.error('Erro na resposta da API:', responseData);
        throw new Error(responseData.error || 'Erro ao criar pagamento PIX');
      }

      // Garante que todos os campos necessários estejam presentes
      if (!responseData.qrCodeBase64 || !responseData.qrCodeText) {
        console.error('Dados do QR Code ausentes:', responseData);
        throw new Error('Dados do QR Code não recebidos');
      }

      return responseData;
    } catch (error) {
      console.error('Erro ao criar pagamento PIX:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao criar pagamento PIX. Tente novamente.');
      throw error;
    }
  }

  async createCreditCardPayment(paymentData: PaymentData, cardData: CreditCardData): Promise<CreditCardPaymentResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('API key não configurada');
      }

      console.log('Enviando dados para pagamento com cartão:', { paymentData, cardData });

      const response = await fetch('/api/credit-card/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...paymentData,
          card: cardData,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta da API:', responseData);
        throw new Error(responseData.error || 'Erro ao processar pagamento com cartão');
      }

      return responseData;
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar pagamento com cartão. Tente novamente.');
      throw error;
    }
  }

  async getPixPaymentStatus(transactionId: string): Promise<PixPaymentResponse> {
    try {
      const response = await fetch(`/api/pix/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao verificar status do pagamento');
      }

      return responseData;
    } catch (error) {
      console.error('Erro ao verificar status do pagamento:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService(); 