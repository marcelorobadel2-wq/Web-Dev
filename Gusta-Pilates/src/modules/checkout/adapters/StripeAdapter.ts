
import { IPaymentGateway } from './IPaymentGateway';
import { PaymentData, TransactionResult, PaymentMethodType } from '../domain/types';

// Mock do SDK do Stripe para fins de tipagem
declare const Stripe: any;

export class StripeAdapter implements IPaymentGateway {
  id = 'stripe_br';
  name = 'Stripe Brasil';
  private stripeInstance: any = null;
  private publicKey: string;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }

  async initialize(): Promise<void> {
    if (window.document.getElementById('stripe-js')) return;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.id = 'stripe-js';
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        this.stripeInstance = Stripe(this.publicKey);
        console.log('[StripeAdapter] Initialized');
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  supportsMethod(method: PaymentMethodType): boolean {
    return ['CREDIT_CARD'].includes(method);
  }

  async processPayment(data: PaymentData): Promise<TransactionResult> {
    try {
      // 1. Em um cenário real, o "processPayment" do frontend apenas:
      //    a) Coleta o token do cartão (via Elements ou Tokenização direta)
      //    b) Envia o token + dados do pedido para o SEU Backend
      //    c) Seu Backend fala com a API da Stripe e retorna o status

      // Simulação de chamada ao Backend Próprio
      console.log('[StripeAdapter] Sending data to Backend API...', data);
      
      await new Promise(r => setTimeout(r, 2000)); // Latência simulada

      // Sucesso Simulado
      return {
        transactionId: `pi_${Math.random().toString(36).substring(7)}`,
        status: 'APPROVED',
        message: 'Pagamento processado com sucesso via Stripe'
      };

    } catch (error: any) {
      return {
        transactionId: '',
        status: 'ERROR',
        message: error.message || 'Falha ao processar Stripe'
      };
    }
  }

  // Método específico para UI Customizada onde você controla os inputs
  async createCardToken(cardElement: any): Promise<string> {
    const { token, error } = await this.stripeInstance.createToken(cardElement);
    if (error) throw new Error(error.message);
    return token.id;
  }
}
