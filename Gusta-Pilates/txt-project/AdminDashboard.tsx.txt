import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, DollarSign, TrendingUp, Bell, ArrowUpRight, ArrowDownRight,
  LogOut, Activity, ShoppingBag, MessageCircle, Plus, Trash2, Save, Smartphone, 
  Settings, User, MousePointerClick, ToggleLeft, ToggleRight, Link as LinkIcon,
  Bot, Download, Upload, Code, Eye, Edit3
} from 'lucide-react';
import { BotConfig, BotQuestion } from '../types';

interface AdminDashboardProps {
  onExit: () => void;
}

// Configuração Padrão Inicial
const INITIAL_BOT_CONFIG: BotConfig = {
  isActive: true,
  identity: {
    botName: "HelpBot",
    companyName: "Assistente Virtual",
    avatarUrl: "", 
    welcomeMessage: "Olá! Sou o HelpBot. Posso ajudar você a encontrar o plano ideal?"
  },
  behavior: {
    autoOpenSeconds: 10,
    soundEnabled: true,
    showNotificationBadge: true
  },
  questions: [
    { 
      id: 1, 
      question: "Como funciona?", 
      answer: "É um método 100% online focado em queima metabólica sem impacto.",
      actionType: 'text'
    }
  ]
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('bot');
  const [botConfig, setBotConfig] = useState<BotConfig>(INITIAL_BOT_CONFIG);
  const [editingQuestion, setEditingQuestion] = useState<Partial<BotQuestion>>({ actionType: 'text' });
  
  // Estado para responsividade Mobile (Alternar entre Editor e Preview)
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  
  // Estado para Importação JSON
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  // Carregar Config
  useEffect(() => {
    const saved = localStorage.getItem('gusta_bot_config_v2');
    if (saved) {
      try {
        setBotConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Erro parse bot config", e);
      }
    }
  }, []);

  // Salvar Config
  useEffect(() => {
    localStorage.setItem('gusta_bot_config_v2', JSON.stringify(botConfig));
  }, [botConfig]);

  // Handlers do Bot
  const handleIdentityChange = (field: string, value: string) => {
    setBotConfig(prev => ({
      ...prev,
      identity: { ...prev.identity, [field]: value }
    }));
  };

  const handleBehaviorChange = (field: string, value: any) => {
    setBotConfig(prev => ({
      ...prev,
      behavior: { ...prev.behavior, [field]: value }
    }));
  };

  const addQuestion = () => {
    if (!editingQuestion.question || !editingQuestion.answer) return;
    
    const newQ: BotQuestion = {
      id: Date.now(),
      question: editingQuestion.question,
      answer: editingQuestion.answer,
      actionType: editingQuestion.actionType || 'text',
      actionLabel: editingQuestion.actionLabel,
      actionValue: editingQuestion.actionValue
    };

    setBotConfig(prev => ({ ...prev, questions: [...prev.questions, newQ] }));
    setEditingQuestion({ actionType: 'text', question: '', answer: '', actionLabel: '', actionValue: '' });
  };

  const deleteQuestion = (id: number) => {
    setBotConfig(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  // Handlers JSON
  const handleExportJson = () => {
    const data = JSON.stringify(botConfig.questions, null, 2);
    navigator.clipboard.writeText(data);
    alert("Padrão JSON copiado! Cole no seu chat de IA favorito para gerar mais perguntas.");
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        // Validação básica
        const validQuestions = parsed.map((q: any) => ({
             id: q.id || Date.now() + Math.random(),
             question: q.question || "Sem pergunta",
             answer: q.answer || "Sem resposta",
             actionType: q.actionType || 'text',
             actionLabel: q.actionLabel,
             actionValue: q.actionValue
        }));
        
        setBotConfig(prev => ({ ...prev, questions: [...prev.questions, ...validQuestions] }));
        setShowJsonModal(false);
        setJsonInput('');
        alert(`${validQuestions.length} diálogos importados com sucesso!`);
      } else {
        alert("O JSON deve ser uma lista (array) de perguntas.");
      }
    } catch (e) {
      alert("Erro ao ler JSON. Verifique a formatação.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans overflow-hidden">
      
      {/* SIDEBAR (Desktop) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="text-xl font-black tracking-tighter text-white italic">
            HELP<span className="text-brand-500">BOT</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">ADMIN CONSOLE</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'bot', label: 'Editor do Chat', icon: MessageCircle },
            { id: 'json', label: 'Importar/IA', icon: Code },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={onExit} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
            <LogOut className="w-5 h-5" /> Sair
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen relative w-full">
        
        {/* HEADER */}
        <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
             <button onClick={onExit} className="md:hidden text-slate-400"><ArrowDownRight className="rotate-135 w-6 h-6"/></button>
             <h1 className="text-sm font-bold text-slate-400 uppercase tracking-widest hidden md:block">
               {activeTab === 'bot' ? 'Configuração HelpBot' : 'Painel'}
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${botConfig.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs font-mono text-slate-500">{botConfig.isActive ? 'ATIVO' : 'OFF'}</span>
             </div>
          </div>
        </header>

        {/* MOBILE TABS (Aparece só em telas pequenas) */}
        <div className="lg:hidden flex border-b border-slate-800 bg-slate-900 shrink-0">
            <button 
                onClick={() => setMobileView('editor')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${mobileView === 'editor' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-slate-500'}`}
            >
                <Edit3 className="w-4 h-4"/> Editor
            </button>
            <button 
                onClick={() => setMobileView('preview')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${mobileView === 'preview' ? 'text-brand-500 border-b-2 border-brand-500' : 'text-slate-500'}`}
            >
                <Eye className="w-4 h-4"/> Preview
            </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative flex flex-col lg:flex-row">
          
          {/* EDITOR COLUMN (Escondido no mobile se view for preview) */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800 border-r border-slate-800 ${
              mobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}>
              
            {activeTab === 'json' ? (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-500/10 rounded-lg"><Code className="text-blue-500 w-6 h-6"/></div>
                            <h3 className="text-lg font-bold text-white">IA Integration (JSON)</h3>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Use este padrão para gerar diálogos com IA. Copie o padrão atual, peça para o ChatGPT gerar mais, e cole o resultado aqui.
                        </p>

                        <div className="space-y-4">
                            <button 
                                onClick={handleExportJson}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-mono text-xs transition-all"
                            >
                                <Upload className="w-4 h-4"/> Copiar Padrão Atual (Exportar)
                            </button>
                            
                            <div className="relative">
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder='Cole o JSON aqui (ex: [{"question": "...", "answer": "..."}])'
                                    className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-green-400 focus:border-brand-500 outline-none resize-none"
                                />
                            </div>

                            <button 
                                onClick={handleImportJson}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-brand-500/20"
                            >
                                <Download className="w-4 h-4"/> Importar Diálogos
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-8">
                    
                    {/* Identity Section */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                            <div className="p-2 bg-brand-500/10 rounded-lg"><User className="text-brand-500 w-5 h-5" /></div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Identidade</h3>
                                <p className="text-xs text-slate-500">Persona do HelpBot.</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Nome</label>
                                <input 
                                    value={botConfig.identity.botName}
                                    onChange={(e) => handleIdentityChange('botName', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-brand-500 outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Empresa</label>
                                <input 
                                    value={botConfig.identity.companyName}
                                    onChange={(e) => handleIdentityChange('companyName', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-brand-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Avatar URL</label>
                                <input 
                                    value={botConfig.identity.avatarUrl}
                                    onChange={(e) => handleIdentityChange('avatarUrl', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm focus:border-brand-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Mensagem Inicial</label>
                                <textarea 
                                    value={botConfig.identity.welcomeMessage}
                                    onChange={(e) => handleIdentityChange('welcomeMessage', e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm focus:border-brand-500 outline-none h-20 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Questions Builder */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg"><MousePointerClick className="text-emerald-500 w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Perguntas e Respostas</h3>
                                    <p className="text-xs text-slate-500">O que o usuário vai clicar.</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveTab('json')} className="text-xs text-brand-400 hover:underline flex items-center gap-1">
                                <Code className="w-3 h-3"/> Modo JSON
                            </button>
                        </div>

                        {/* Input Area */}
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    placeholder="Pergunta do Cliente (Botão)"
                                    value={editingQuestion.question || ''}
                                    onChange={(e) => setEditingQuestion(prev => ({ ...prev, question: e.target.value }))}
                                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none text-white"
                                />
                                <select 
                                    value={editingQuestion.actionType}
                                    onChange={(e) => setEditingQuestion(prev => ({ ...prev, actionType: e.target.value as any }))}
                                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none text-white"
                                >
                                    <option value="text">Apenas Texto</option>
                                    <option value="scroll">Rolar Página</option>
                                    <option value="link">Abrir Link</option>
                                    <option value="whatsapp">WhatsApp</option>
                                </select>
                            </div>
                            
                            <textarea 
                                placeholder="Resposta do HelpBot..."
                                value={editingQuestion.answer || ''}
                                onChange={(e) => setEditingQuestion(prev => ({ ...prev, answer: e.target.value }))}
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-brand-500 outline-none text-white resize-none h-20"
                            />

                            {/* Dynamic Action Fields */}
                            {editingQuestion.actionType !== 'text' && (
                                <div className="p-3 bg-brand-900/10 border border-brand-500/20 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                                    <input 
                                        placeholder="Texto do Botão (Ex: VER AGORA)"
                                        value={editingQuestion.actionLabel || ''}
                                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, actionLabel: e.target.value }))}
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:border-brand-500 outline-none text-white"
                                    />
                                    <input 
                                        placeholder={
                                            editingQuestion.actionType === 'scroll' ? 'ID da Seção (ex: offer)' :
                                            editingQuestion.actionType === 'whatsapp' ? 'Número (ex: 5511999...)' :
                                            'URL (https://...)'
                                        }
                                        value={editingQuestion.actionValue || ''}
                                        onChange={(e) => setEditingQuestion(prev => ({ ...prev, actionValue: e.target.value }))}
                                        className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs focus:border-brand-500 outline-none text-white"
                                    />
                                </div>
                            )}

                            <button onClick={addQuestion} className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Adicionar Pergunta
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-2">
                             {botConfig.questions.map((q, idx) => (
                                 <div key={q.id} className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg hover:border-slate-700 group">
                                     <div className="flex-1 min-w-0 pr-4">
                                         <p className="text-sm font-bold text-white mb-0.5 truncate">{q.question}</p>
                                         <p className="text-xs text-slate-500 truncate">{q.answer}</p>
                                         {q.actionType !== 'text' && (
                                             <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 uppercase font-bold">
                                                 <LinkIcon className="w-3 h-3"/> {q.actionType}
                                             </span>
                                         )}
                                     </div>
                                     <button onClick={() => deleteQuestion(q.id)} className="text-slate-600 hover:text-red-500 p-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* PREVIEW COLUMN (Escondido no mobile se view for editor) */}
          <div className={`w-full lg:w-[400px] bg-slate-950 border-l border-slate-800 flex flex-col items-center justify-center p-8 relative ${
              mobileView === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}>
              <div className="absolute top-4 left-0 w-full text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Simulador de iPhone</p>
              </div>

              {/* Phone Mockup */}
              <div className="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-xl z-20"></div>
                  
                  {/* Screen Content */}
                  <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col">
                      {/* Fake Background */}
                      <div className="opacity-30 blur-[2px] pointer-events-none p-4 space-y-4 mt-10">
                          <div className="h-32 bg-slate-800 rounded-xl w-full"></div>
                          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                          <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                          <div className="h-20 bg-slate-800 rounded-xl w-full"></div>
                      </div>

                      {/* THE BOT UI */}
                      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2 max-h-[500px]">
                         
                         {/* Chat Window Mockup */}
                         <motion.div 
                            layout
                            className="w-[260px] bg-white text-slate-800 rounded-2xl shadow-xl overflow-hidden text-xs flex flex-col origin-bottom-right"
                         >
                             {/* Header */}
                             <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-3 flex items-center gap-2">
                                 <div className="w-8 h-8 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                                     {botConfig.identity.avatarUrl ? <img src={botConfig.identity.avatarUrl} className="w-full h-full object-cover"/> : <Bot className="text-white w-5 h-5"/>}
                                 </div>
                                 <div className="flex-1 text-white">
                                     <p className="font-bold leading-tight truncate">{botConfig.identity.botName}</p>
                                     <p className="text-[9px] opacity-80 truncate">{botConfig.identity.companyName}</p>
                                 </div>
                             </div>
                             
                             {/* Body */}
                             <div className="p-3 bg-slate-50 h-56 overflow-y-auto space-y-3">
                                 <div className="bg-white border border-slate-200 p-2.5 rounded-xl rounded-tl-none text-slate-600 shadow-sm leading-snug">
                                    {botConfig.identity.welcomeMessage}
                                 </div>
                                 
                                 {/* Simulação de Pergunta/Resposta Recente */}
                                 {botConfig.questions.length > 0 && (
                                     <>
                                         <div className="flex justify-end">
                                             <div className="bg-brand-500 text-white p-2.5 rounded-xl rounded-tr-none shadow-sm leading-snug">
                                                {botConfig.questions[0].question}
                                             </div>
                                         </div>
                                         <div className="bg-white border border-slate-200 p-2.5 rounded-xl rounded-tl-none text-slate-600 shadow-sm leading-snug">
                                            {botConfig.questions[0].answer}
                                         </div>
                                     </>
                                 )}
                             </div>

                             {/* Input Area (Visual Only) */}
                             <div className="p-2 bg-white border-t border-slate-100 flex flex-col gap-2">
                                 <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide px-1">Escolha uma opção:</div>
                                 <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto">
                                    {botConfig.questions.map(q => (
                                        <div key={q.id} className="px-3 py-2 bg-slate-100 rounded-lg text-slate-600 text-[10px] border border-slate-200 truncate">
                                            {q.question}
                                        </div>
                                    ))}
                                 </div>
                             </div>
                         </motion.div>

                         {/* FAB Mockup */}
                         <div className="w-12 h-12 bg-brand-500 rounded-full shadow-lg flex items-center justify-center text-white border-2 border-white/20">
                            {botConfig.identity.avatarUrl ? <img src={botConfig.identity.avatarUrl} className="w-full h-full rounded-full object-cover"/> : <MessageCircle className="w-6 h-6"/>}
                         </div>

                      </div>
                  </div>
              </div>
          </div>

        </div>

      </main>
    </div>
  );
};