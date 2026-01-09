
import React from 'react';
import { Lock } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center text-slate-600 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
          <span className="text-xl font-bold text-white tracking-tighter">GUSTA PILATES</span>
        </div>
        
        <p className="max-w-2xl mx-auto mb-8">
          AVISO LEGAL: Os resultados podem variar de pessoa para pessoa. Exercícios físicos requerem autorização médica prévia. Este produto não substitui o parecer profissional. Sempre consulte um médico para tratar de assuntos relativos à saúde.
        </p>

        <div className="flex justify-center gap-8 mb-8">
          <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <a href="#" className="hover:text-white transition-colors">Contato</a>
        </div>

        <p>© 2025 Gusta Pilates LTDA. Todos os direitos reservados.</p>
        <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-xs">CNPJ: 00.000.000/0001-00</p>
            
            {/* Botão de Acesso Administrativo Discreto */}
            {onAdminClick && (
                <button 
                    onClick={onAdminClick}
                    className="flex items-center gap-1 text-[10px] text-slate-700 hover:text-brand-500 transition-colors mt-2"
                >
                    <Lock className="w-3 h-3" />
                    Área Administrativa
                </button>
            )}
        </div>
      </div>
    </footer>
  );
};
