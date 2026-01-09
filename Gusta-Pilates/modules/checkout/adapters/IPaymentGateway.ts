
import { PaymentData, TransactionResult, PaymentMethodType } from '../domain/types';

export interface IPaymentGateway {
  id: string;
  name: string;
  
  /**
   * Inicializa scripts externos (Stripe.js, MercadoPago.js, PayPal SDK)
   */
  initialize(): Promise<void>;

  /**
   * Verifica se o gateway suporta o método escolhido
   */
  supportsMethod(method: PaymentMethodType): boolean;

  /**
   * Processa o pagamento.
   */
  processPayment(data: PaymentData): Promise<TransactionResult>;

  /**
   * Tokenização de cartão (Opcional)
   */
  createCardToken?(cardData: any): Promise<string>;
}
