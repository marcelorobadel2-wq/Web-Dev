
import React, { useState, useEffect } from 'react';
import { useCheckout } from '../context/CheckoutContext';
import { PaymentMethodType } from '../domain/types';
import { CreditCard, Wallet, Loader2, CheckCircle, AlertCircle, QrCode, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export const CheckoutDemo: React.FC = () => {
  const { availableGateways, activeGateway, selectGateway, processCheckout, isLoading, status, result } = useCheckout();
  const [method, setMethod] = useState<PaymentMethodType>('PIX');

  useEffect(() => {
    if (method === 'PIX') selectGateway('pix_native');
    if (method === 'CREDIT_CARD') selectGateway('stripe_br');
    if (method === 'PAYPAL_WALLET') selectGateway('paypal_intl');
  }, [method, selectGateway]);

  const handlePay = () => {
    processCheckout({
      amount: 49700, 
      currency: 'BRL',
      method: method,
      customer: {
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        document: '000.000.000-00'
      }
    });
  };

  const copyToClipboard = () => {
    if (result?.qrCode) {
        navigator.clipboard.writeText(result.qrCode);
        alert('Código PIX copiado!');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
      
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        Checkout Seguro <LockIcon className="w-5 h-5 text-brand-500"/>
      </h2>

      <div className="mb-8">
        <label className="text-xs text-slate-500 uppercase font-bold mb-3 block">Escolha como pagar</label>
        <div className="grid grid-cols-3 gap-2">
            <button 
                onClick={() => setMethod('PIX')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${method === 'PIX' ? 'border-brand-500 bg-brand-500/10 text-white shadow-[0_0_15px_-3px_rgba(14,165,233,0.3)]' : 'border-slate-800 bg-slate-800 text-slate-500 hover:border-slate-600'}`}
            >
                <QrCode className="w-6 h-6" />
                <span className="text-xs font-bold">PIX</span>
            </button>
            <button 
                onClick={() => setMethod('CREDIT_CARD')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${method === 'CREDIT_CARD' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-800 text-slate-500 hover:border-slate-600'}`}
            >
                <CreditCard className="w-6 h-6" />
                <span className="text-xs font-bold">Cartão</span>
            </button>
            <button 
                onClick={() => setMethod('PAYPAL_WALLET')}
                className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${method === 'PAYPAL_WALLET' ? 'border-brand-500 bg-brand-500/10 text-white' : 'border-slate-800 bg-slate-800 text-slate-500 hover:border-slate-600'}`}
            >
                <Wallet className="w-6 h-6" />
                <span className="text-xs font-bold">PayPal</span>
            </button>
        </div>
      </div>

      <div className="min-h-[150px]">
        {method === 'PIX' && status === 'PENDING' && result?.qrCode && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white p-4 rounded-lg mb-6">
                <p className="text-slate-800 text-sm font-bold mb-2">Escaneie para pagar</p>
                <div className="w-40 h-40 bg-slate-200 mx-auto mb-3 flex items-center justify-center rounded">
                    <QrCode className="w-32 h-32 text-slate-800" />
                </div>
                <button onClick={copyToClipboard} className="w-full py-2 bg-slate-100 text-brand-600 font-bold text-xs rounded border border-slate-200 hover:bg-slate-200 flex items-center justify-center gap-2">
                    <Copy className="w-3 h-3"/> Copiar Código PIX
                </button>
            </motion.div>
        )}

        {status === 'APPROVED' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-500/10 border border-green-500/50 p-4 rounded-lg mb-6 flex items-center gap-3">
                <CheckCircle className="text-green-500 w-6 h-6" />
                <div>
                    <h4 className="font-bold text-green-400">Aprovado!</h4>
                    <p className="text-xs text-green-300">Acesso liberado no seu e-mail.</p>
                </div>
            </motion.div>
        )}

        {status === 'ERROR' && (
            <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg mb-6 flex items-center gap-3">
                <AlertCircle className="text-red-500 w-6 h-6" />
                <p className="text-red-400 text-sm">{result?.message}</p>
            </div>
        )}
      </div>

      {status !== 'PENDING' && status !== 'APPROVED' && (
          <button
            onClick={handlePay}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
                <>
                 {method === 'PIX' ? 'Gerar PIX R$ 497,00' : 'Pagar R$ 497,00'}
                </>
            )}
          </button>
      )}

      <p className="text-center text-[10px] text-slate-500 mt-4 flex justify-center gap-2">
         <span>🔒 256-bit SSL</span>
         <span>🛡️ Compra Segura</span>
      </p>
    </div>
  );
};

const LockIcon = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);
