
import { IPaymentGateway } from './IPaymentGateway';
import { PaymentData, TransactionResult, PaymentMethodType } from '../domain/types';

export class PayPalAdapter implements IPaymentGateway {
  id = 'paypal_intl';
  name = 'PayPal International';
  private clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async initialize(): Promise<void> {
    // PayPal geralmente injeta o botão via script específico ou React Component
    console.log('[PayPalAdapter] SDK Ready logic would go here');
    return Promise.resolve();
  }

  supportsMethod(method: PaymentMethodType): boolean {
    return ['PAYPAL_WALLET', 'CREDIT_CARD'].includes(method);
  }

  async processPayment(data: PaymentData): Promise<TransactionResult> {
    // Lógica para Checkout Redirect ou Popup
    console.log('[PayPalAdapter] Redirecting to PayPal...');
    
    await new Promise(r => setTimeout(r, 1500));

    // Simula a criação de uma ordem no backend que retorna a URL de aprovação
    return {
      transactionId: `PAYID-${Math.random().toString(36).substring(7)}`,
      status: 'PENDING', // PayPal geralmente começa como Pending até o usuário aprovar
      redirectUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=EC-XXXXXX',
      message: 'Redirecionando para PayPal...'
    };
  }
}
