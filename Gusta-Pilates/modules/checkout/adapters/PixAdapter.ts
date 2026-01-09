
import { IPaymentGateway } from './IPaymentGateway';
import { PaymentData, TransactionResult, PaymentMethodType } from '../domain/types';

export class PixAdapter implements IPaymentGateway {
  id = 'pix_native';
  name = 'PIX Instantâneo';

  async initialize(): Promise<void> {
    console.log('[PixAdapter] Ready');
    return Promise.resolve();
  }

  supportsMethod(method: PaymentMethodType): boolean {
    return ['PIX'].includes(method);
  }

  async processPayment(data: PaymentData): Promise<TransactionResult> {
    console.log('[PixAdapter] Generating QR Code...');
    await new Promise(r => setTimeout(r, 1000));

    return {
      transactionId: `pix_${Math.random().toString(36).substring(7)}`,
      status: 'PENDING', 
      qrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540410.005802BR5913Gusta Pilates6008Brasilia62070503***6304E2CA',
      message: 'QR Code gerado com sucesso. Aguardando pagamento.'
    };
  }
}
