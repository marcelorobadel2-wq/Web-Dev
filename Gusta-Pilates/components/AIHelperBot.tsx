import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot, Send, ArrowDown, ExternalLink, MessageCircle } from 'lucide-react';
import { BotConfig, BotQuestion } from '../types';

// Configuração Padrão (Fallback)
const DEFAULT_CONFIG: BotConfig = {
  isActive: true,
  identity: {
    botName: "Suporte Gusta",
    companyName: "Gusta Pilates",
    avatarUrl: "", // Vazio usa ícone padrão
    welcomeMessage: "Olá! Vi que você está interessada em definir o corpo. Posso tirar uma dúvida rápida?"
  },
  behavior: {
    autoOpenSeconds: 15,
    soundEnabled: true,
    showNotificationBadge: true
  },
  questions: [
    { 
      id: 1, 
      question: "Qual o valor do curso?", 
      answer: "O valor promocional de hoje é de R$ 997 por apenas 12x de R$ 49,90.",
      actionType: 'scroll',
      actionLabel: "QUERO APROVEITAR AGORA",
      actionValue: "offer"
    },
    { 
      id: 2, 
      question: "Tenho hérnia de disco...", 
      answer: "O método é perfeito para você! Ele fortalece a musculatura profunda que protege sua coluna, sem impacto.",
      actionType: 'text'
    },
    { 
      id: 3, 
      question: "Falar com Humano", 
      answer: "Claro! Vou te transferir para o WhatsApp da nossa equipe agora mesmo.",
      actionType: 'whatsapp',
      actionLabel: "Abrir WhatsApp",
      actionValue: "5511999999999" // Exemplo
    }
  ]
};

export const AIHelperBot: React.FC = () => {
  const [config, setConfig] = useState<BotConfig>(DEFAULT_CONFIG);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedAuto, setHasOpenedAuto] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ type: 'bot' | 'user', text: string, action?: BotQuestion }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Carregar Configuração
  useEffect(() => {
    const loadConfig = () => {
      const saved = localStorage.getItem('gusta_bot_config_v2');
      if (saved) {
        try {
          setConfig(JSON.parse(saved));
        } catch (e) {
          console.error("Erro ao carregar config do bot", e);
        }
      }
    };

    loadConfig();
    window.addEventListener('storage', loadConfig);
    
    // Inicializar som de notificação (opcional)
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3');

    return () => window.removeEventListener('storage', loadConfig);
  }, []);

  // Inicializar Chat ao abrir a primeira vez
  useEffect(() => {
    if (chatHistory.length === 0 && config.identity) {
      setChatHistory([{ type: 'bot', text: config.identity.welcomeMessage }]);
    }
  }, [config.identity]);

  // Auto-Open Logic
  useEffect(() => {
    if (!config.isActive || hasOpenedAuto || config.behavior.autoOpenSeconds <= 0) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasOpenedAuto(true);
      if (config.behavior.soundEnabled) {
        audioRef.current?.play().catch(() => {}); // Ignora erro de autoplay policy
      }
    }, config.behavior.autoOpenSeconds * 1000);

    return () => clearTimeout(timer);
  }, [config, hasOpenedAuto]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isOpen, isTyping]);

  const handleAsk = (questionId: number) => {
    const q = config.questions.find(item => item.id === questionId);
    if (!q) return;

    // 1. Adiciona pergunta do usuário
    setChatHistory(prev => [...prev, { type: 'user', text: q.question }]);
    setIsTyping(true);

    // 2. Simula delay de digitação
    setTimeout(() => {
      setIsTyping(false);
      setChatHistory(prev => [...prev, { 
        type: 'bot', 
        text: q.answer,
        action: q.actionType !== 'text' ? q : undefined
      }]);
      
      if (config.behavior.soundEnabled) {
        audioRef.current?.play().catch(() => {});
      }
    }, 800);
  };

  const handleActionClick = (action: BotQuestion) => {
    if (action.actionType === 'scroll' && action.actionValue) {
      setIsOpen(false);
      const element = document.getElementById(action.actionValue.replace('#', ''));
      element?.scrollIntoView({ behavior: 'smooth' });
    } 
    else if (action.actionType === 'link' && action.actionValue) {
      window.open(action.actionValue, '_blank');
    }
    else if (action.actionType === 'whatsapp') {
      const msg = encodeURIComponent("Olá! Vim pelo site e tenho uma dúvida.");
      window.open(`https://wa.me/${action.actionValue}?text=${msg}`, '_blank');
    }
  };

  if (!config.isActive) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[90vw] md:w-[350px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header Personalizado */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-4 flex items-center justify-between shadow-md relative z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {config.identity.avatarUrl ? (
                    <img src={config.identity.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white/30 object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-brand-600 rounded-full"></span>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm leading-tight">{config.identity.botName}</h4>
                  <span className="text-[10px] text-brand-100 opacity-90">{config.identity.companyName}</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
              <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest my-2">Início da conversa</p>
              
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Balão de Texto */}
                  <div className={`max-w-[85%] p-3.5 text-sm leading-relaxed shadow-sm relative ${
                    msg.type === 'user' 
                      ? 'bg-brand-500 text-white rounded-2xl rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Rich Action Button (Se existir) */}
                  {msg.action && (
                    <motion.button
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => msg.action && handleActionClick(msg.action)}
                      className="mt-2 mr-auto bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all"
                    >
                      {msg.action.actionType === 'scroll' && <ArrowDown className="w-3 h-3" />}
                      {msg.action.actionType === 'whatsapp' && <MessageCircle className="w-3 h-3" />}
                      {(msg.action.actionType === 'link' || !msg.action.actionType) && <ExternalLink className="w-3 h-3" />}
                      {msg.action.actionLabel || "Clique aqui"}
                    </motion.button>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 flex gap-1 items-center h-10 w-16">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Questions Area (Input) */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2 relative z-20">
              {config.questions.map(q => (
                <button
                  key={q.id}
                  onClick={() => handleAsk(q.id)}
                  className="text-xs text-left px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-slate-700 hover:border-brand-200 dark:hover:border-slate-600 transition-all font-medium flex justify-between items-center group"
                >
                  {q.question}
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-brand-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-brand-500 hover:bg-brand-400 rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(14,165,233,0.4)] border-2 border-white/20 transition-colors"
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="absolute">
               <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute">
               {config.identity.avatarUrl ? (
                 <img src={config.identity.avatarUrl} className="w-full h-full rounded-full object-cover" alt="Bot" />
               ) : (
                 <MessageSquare className="w-7 h-7 fill-current" />
               )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Notification Badge */}
        {!isOpen && config.behavior.showNotificationBadge && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[9px] font-bold">1</span>
            </span>
        )}
      </motion.button>
    </div>
  );
};