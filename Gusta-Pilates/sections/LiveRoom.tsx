import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Lock, Send, MessageCircle } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

// Tipos para o chat simulado
interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  type: 'question' | 'result' | 'support' | 'normal';
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: '1', user: 'Ana Clara', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', text: 'Gente, acabei a aula 2 agora. Estou suando muito, é normal?', time: 'há 2 min', type: 'question' },
  { id: '2', user: 'Beatriz M.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', text: 'Simmm Ana! O efeito EPOC é isso aí. Bebe bastante água.', time: 'há 1 min', type: 'support' },
  { id: '3', user: 'Carla Dias', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', text: 'Bom dia meninas! Hoje fechei 7 dias. -1.5kg na balança! 🎉', time: 'agora', type: 'result' },
];

const INCOMING_QUEUE: ChatMessage[] = [
  { id: '4', user: 'Mariana S.', avatar: 'https://randomuser.me/api/portraits/women/90.jpg', text: 'Alguém teve dificuldade com o cardápio no começo?', time: 'agora', type: 'question' },
  { id: '5', user: 'Fernanda L.', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', text: 'Mari, eu achei super tranquilo. Tudo coisa que a gente já tem em casa.', time: 'agora', type: 'support' },
  { id: '6', user: 'Juliana P.', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', text: 'Minha calça 40 entrou hoje sem apertar!!! Tô chocada.', time: 'agora', type: 'result' },
  { id: '7', user: 'Renata F.', avatar: 'https://randomuser.me/api/portraits/women/55.jpg', text: 'Bora que hoje é dia de glúteo 🔥', time: 'agora', type: 'normal' },
  { id: '8', user: 'Suporte Gusta', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', text: 'Parabéns pelos resultados, Juliana! Foco total.', time: 'agora', type: 'support' },
];

export const LiveRoom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [activeUsers, setActiveUsers] = useState(142);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [queueIndex, setQueueIndex] = useState(0);

  // Simulação de chat vivo
  useEffect(() => {
    const interval = setInterval(() => {
      if (queueIndex < INCOMING_QUEUE.length) {
        setMessages(prev => [...prev, INCOMING_QUEUE[queueIndex]]);
        setQueueIndex(prev => prev + 1);
        
        // Variação leve nos usuários online
        setActiveUsers(prev => prev + Math.floor(Math.random() * 3) - 1);
      }
    }, 4500); // Nova mensagem a cada 4.5s

    return () => clearInterval(interval);
  }, [queueIndex]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-900 relative">
      <div className="container mx-auto px-4">
        
        <FadeIn className="max-w-3xl mx-auto">
            {/* Header da Sala */}
            <div className="flex items-center justify-between mb-8 px-2">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <h2 className="text-xl font-bold text-white tracking-tight">Comunidade VIP</h2>
                    </div>
                    <p className="text-slate-400 text-sm">Interações em tempo real das alunas</p>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    <Users className="w-4 h-4 text-brand-500" />
                    <span className="text-sm font-mono text-slate-300 font-bold">{activeUsers} online</span>
                </div>
            </div>

            {/* Janela de Chat */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Overlay de Gradiente Superior (Fade) */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-900/90 to-transparent z-10 pointer-events-none"></div>

                {/* Área de Mensagens */}
                <div 
                    ref={scrollRef}
                    className="h-[400px] overflow-y-auto p-6 space-y-6 scroll-smooth scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                className="flex gap-4 items-start"
                            >
                                <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className={`text-sm font-bold ${
                                            msg.user.includes('Suporte') ? 'text-brand-400' : 'text-slate-200'
                                        }`}>
                                            {msg.user}
                                        </span>
                                        <span className="text-xs text-slate-600">{msg.time}</span>
                                    </div>
                                    <div className={`inline-block rounded-r-xl rounded-bl-xl px-4 py-2.5 text-sm leading-relaxed ${
                                        msg.type === 'result' 
                                            ? 'bg-brand-900/20 text-brand-100 border border-brand-500/20' 
                                            : msg.type === 'question'
                                            ? 'bg-slate-800 text-slate-300'
                                            : 'bg-slate-800/80 text-slate-300'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Área de Input Bloqueada */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 relative">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                         <div className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-slate-900 px-4 py-2 rounded-full border border-slate-800 shadow-lg">
                            <Lock className="w-3 h-3" />
                            <span>Participação liberada após o acesso</span>
                         </div>
                    </div>
                    
                    <div className="flex gap-3 opacity-30 pointer-events-none select-none">
                        <div className="w-10 h-10 rounded-full bg-slate-800"></div>
                        <div className="flex-1 bg-slate-800 rounded-full h-10"></div>
                        <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center">
                            <Send className="w-4 h-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transição para Oferta */}
            <div className="mt-16 text-center">
                <p className="text-xl md:text-2xl text-slate-300 font-light italic">
                    "Pessoas reais. Resultados reais. <span className="text-brand-400 font-semibold not-italic">A diferença entre elas e você é apenas a decisão de começar.</span>"
                </p>
                <div className="w-px h-16 bg-gradient-to-b from-slate-800 to-transparent mx-auto mt-8"></div>
            </div>

        </FadeIn>
      </div>
    </section>
  );
};
