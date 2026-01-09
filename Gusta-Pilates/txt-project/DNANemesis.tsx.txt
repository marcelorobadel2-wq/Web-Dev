import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, X, Copy, Check, Send, Sparkles, RefreshCw, History, ShieldAlert, Plus, ThumbsUp, ThumbsDown, Bookmark, Save } from 'lucide-react';

// --- TYPES & INVARIANTS ---
type AggressivenessLevel = 'Baixa' | 'Média' | 'Alta' | 'Extrema';

interface PromptData {
  niche: string;
  product: string;
  audience: string[];
  goal: string;
  aggressiveness: AggressivenessLevel;
  observations: string; // Novo campo
}

interface HistoryItem {
  id: number;
  timestamp: string;
  iteration: number;
  preview: string;
  fullPrompt: string;
}

interface SavedItem extends HistoryItem {
  notes?: string;
}

// --- IMMUTABLE CORE LOGIC ---
const CORE_DIRECTIVES = `
PAPEL: Você é um Copywriter de Resposta Direta de elite e Psicólogo Comportamental.
METODOLOGIA: "O Protocolo de Funil de Conversão" (Atenção -> Agitação -> Solução -> Prova -> Ação).
OBJETIVO: Gerar copy de alta conversão que seja quimicamente persuasiva, eticamente agressiva e impossível de ignorar.
`;

const NEGATIVE_CONSTRAINTS = `
ERROS FATAIS A EVITAR (ESTRITO):
- NÃO use voz passiva. Use verbos ativos e de comando.
- NÃO seja vago. Seja específico (use números, prazos, substantivos concretos).
- NÃO resuma a estratégia. EXECUTE a copy.
- NÃO alucine funcionalidades não fornecidas no contexto.
- NÃO use jargão corporativo. Fale como um humano.
`;

const AGGRESSIVENESS_MATRIX: Record<AggressivenessLevel, string> = {
  'Baixa': 'Tom: Consultivo, empático, educacional. Foco em segurança. Baixa pressão.',
  'Média': 'Tom: Confiante, profissional, claro. Foco na proposta de valor.',
  'Alta': 'Tom: Alta energia, urgente, escasso. Framework Dor-Agitação-Solução.',
  'Extrema': 'Tom: Polarizador, choque, urgência absoluta. Mentalidade "Comprar ou Morrer".'
};

// --- DETERMINISTIC PROMPT GENERATOR ---
const generateMasterPrompt = (data: PromptData, iteration: number): string => {
  const { niche, product, audience, goal, aggressiveness, observations } = data;

  const formattedAudience = audience.length > 0 ? audience.join(', ') : 'Público Geral';

  // 1. Context Layer
  const contextLayer = `
[DADOS CONTEXTUAIS]
- Nicho de Mercado: ${niche.trim()}
- Produto/Solução: ${product.trim()}
- Avatares Alvo: ${formattedAudience}
- Objetivo: ${goal}
- Intensidade: ${aggressiveness}
- Instrução de Estilo: ${AGGRESSIVENESS_MATRIX[aggressiveness]}

[OBSERVAÇÕES E RESTRIÇÕES ESPECÍFICAS DO USUÁRIO]:
"${observations.trim() || "Nenhuma observação adicional. Siga o padrão."}"
`;

  // 2. Task Layer
  let taskLayer = '';

  if (iteration === 1) {
    taskLayer = `
[TAREFA: FASE 1 - ARQUITETURA DE FUNDAÇÃO]
Construa a estrutura da Landing Page no "Modo Deus".

SEÇÕES OBRIGATÓRIAS:
1. O GANCHO (Promessa + Prazo + Risco Reverso).
2. O DIAGNÓSTICO (Inimigo Comum + Validação da Dor para: ${formattedAudience}).
3. O MECANISMO ÚNICO (Solução ${product} + Ingrediente Secreto).
4. A PILHA DE OFERTA (Bônus + Ancoragem).
5. A ENCRUZILHADA (CTA Céu vs Inferno).

FORMATO: Markdown. Negrite gatilhos.
`;
  } else {
    taskLayer = `
[TAREFA: FASE ${iteration} - REFINAMENTO & ESCALADA]
CONTEXTO: Atue como um editor implacável sobre a copy anterior.

OTIMIZAÇÕES:
1. CRITIQUE O GANCHO: Torne a promessa 30% mais específica.
2. AFIE A LÂMINA: Ajuste o tom para nível ${aggressiveness}.
3. MATADOR DE OBJEÇÕES: Crie um FAQ que mate a objeção nº 1.
4. CTA: Reescreva focando no benefício final.
`;
  }

  // 3. Handshake Protocol (Mandatory per User Request)
  const handshakeProtocol = `
[PROTOCOLO DE CONFIRMAÇÃO OBRIGATÓRIO]
ANTES DE GERAR QUALQUER TEXTO DE COPY, VOCÊ DEVE:
1. Resumir brevemente o que entendeu do meu pedido (Nicho, Produto, Restrições).
2. Dizer EXATAMENTE esta frase em letras maiúsculas:
"DEVO EXECUTAR AGORA? SE NÃO: ME DIGA O QUE FAZER!"

Aguarde minha confirmação para gerar a copy completa.
`;

  return `
${CORE_DIRECTIVES.trim()}
${NEGATIVE_CONSTRAINTS.trim()}
${contextLayer.trim()}
${taskLayer.trim()}
${handshakeProtocol.trim()}
`;
};

// --- LOCAL STORAGE KEYS ---
const LS_KEY_FORM = 'dna_nemesis_form_v2';
const LS_KEY_SAVED = 'dna_nemesis_saved_v2';

// --- COMPONENT ---
export const DNANemesis: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  
  // State
  const [iteration, setIteration] = useState(1);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<SavedItem[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  // Form Data
  const [formData, setFormData] = useState<PromptData>({
    niche: '',
    product: '',
    audience: [],
    goal: 'Venda Direta',
    aggressiveness: 'Média',
    observations: ''
  });

  // Load from LocalStorage on Mount
  useEffect(() => {
    const savedForm = localStorage.getItem(LS_KEY_FORM);
    const savedLibrary = localStorage.getItem(LS_KEY_SAVED);

    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        setFormData(parsed);
      } catch (e) { console.error("Erro ao carregar form salvo", e); }
    } else {
      // Default Values (Gusta Pilates Context) se não houver save
      setFormData({
        niche: 'Emagrecimento Feminino & Pilates',
        product: 'Protocolo Gusta Pilates Metabólico',
        audience: ['Mulheres com metabolismo lento', 'Mães no pós-parto'],
        goal: 'Venda Direta',
        aggressiveness: 'Alta',
        observations: 'Não cite valores monetários na copy. Foque na dor das costas e na estética.'
      });
    }

    if (savedLibrary) {
      try {
        setSavedPrompts(JSON.parse(savedLibrary));
      } catch (e) { console.error("Erro ao carregar biblioteca", e); }
    }
  }, []);

  // Save to LocalStorage on Change
  useEffect(() => {
    if (isValid) {
      localStorage.setItem(LS_KEY_FORM, JSON.stringify(formData));
    }
  }, [formData]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_SAVED, JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  // Validation
  const isValid = React.useMemo(() => {
    return (
      formData.niche.trim().length > 2 &&
      formData.product.trim().length > 2 &&
      formData.audience.length > 0
    );
  }, [formData]);

  const currentPrompt = generateMasterPrompt(formData, iteration);

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name !== 'observations' && iteration > 1) setIteration(1); // Observations don't reset iteration necessarily, but major changes do
  };

  // Tag System
  const addTag = () => {
    const value = tagInput.trim().replace(/,$/, '');
    if (value && !formData.audience.includes(value)) {
      setFormData(prev => ({ ...prev, audience: [...prev.audience, value] }));
      setTagInput('');
    }
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.includes(',')) {
      const parts = val.split(',');
      const newTags: string[] = [];
      parts.forEach(part => {
        const clean = part.trim();
        if (clean && !formData.audience.includes(clean)) newTags.push(clean);
      });
      if (newTags.length > 0) {
         setFormData(prev => {
            const uniqueNew = newTags.filter(t => !prev.audience.includes(t));
            return { ...prev, audience: [...prev.audience, ...uniqueNew] };
         });
      }
      setTagInput(val.endsWith(',') ? '' : parts[parts.length - 1]);
    } else {
      setTagInput(val);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !tagInput && formData.audience.length > 0) {
      const newTags = [...formData.audience];
      newTags.pop();
      setFormData(prev => ({ ...prev, audience: newTags }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, audience: prev.audience.filter(t => t !== tagToRemove) }));
  };

  // Actions
  const handleCopy = () => {
    if (!isValid) return;
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Add to History Log
    const displayAudience = formData.audience.join(', ');
    const newItem: HistoryItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      iteration: iteration,
      preview: `[Fase ${iteration}] ${formData.niche.substring(0, 20)}...`,
      fullPrompt: currentPrompt
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleNextIteration = () => {
    if (!isValid) return;
    setIteration(prev => prev + 1);
  };

  const handleApprove = () => {
    if (!isValid) return;
    const newItem: SavedItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      iteration: iteration,
      preview: `PROMPT APROVADO: ${formData.product}`,
      fullPrompt: currentPrompt,
      notes: formData.observations
    };
    setSavedPrompts(prev => [newItem, ...prev]);
    setActiveTab('saved');
    alert("Prompt salvo na biblioteca de Aprovados!");
  };

  const handleReject = () => {
    if (window.confirm("Isso descartará o progresso atual para reiniciar. Deseja continuar?")) {
      setIteration(1);
    }
  };

  const resetSystem = () => {
    if (window.confirm("Isso limpará os campos e o histórico de sessão (Aprovados serão mantidos).")) {
      setIteration(1);
      setHistory([]);
      setFormData({
         niche: '', product: '', audience: [], goal: 'Venda Direta', aggressiveness: 'Média', observations: ''
      });
      localStorage.removeItem(LS_KEY_FORM);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed z-40 bottom-6 right-6 group"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-brand-500 blur-xl opacity-40 animate-pulse-slow"></div>
          <div className="relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-2 border-brand-400 bg-slate-900 shadow-2xl hover:scale-105 transition-transform duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-900/50 to-slate-900"></div>
            <Dna className="w-8 h-8 text-brand-400 relative z-10" />
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
                    <Sparkles className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">DNA Nemesis <span className="text-brand-500">v2.0</span></h2>
                    <p className="text-xs text-slate-400 font-mono">Persistence & Feedback Engine</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                {/* LEFT: Config */}
                <div className="w-full lg:w-1/3 bg-slate-900 p-6 overflow-y-auto border-r border-slate-800 flex flex-col">
                  <div className="flex-1 space-y-5">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Contexto do Negócio</h3>
                    
                    {/* Campos Básicos */}
                    <div className="space-y-3">
                      <input name="niche" value={formData.niche} onChange={handleInputChange} placeholder="Nicho (ex: Emagrecimento)" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none transition-all" />
                      <input name="product" value={formData.product} onChange={handleInputChange} placeholder="Produto (ex: Protocolo X)" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none transition-all" />
                      
                      {/* Tags */}
                      <div className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 flex flex-wrap gap-2">
                        {formData.audience.map((tag, idx) => (
                          <span key={idx} className="bg-brand-500/20 text-brand-300 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                            {tag} <button onClick={() => removeTag(tag)}><X size={12} /></button>
                          </span>
                        ))}
                        <input value={tagInput} onChange={handleTagChange} onKeyDown={handleTagKeyDown} placeholder={formData.audience.length === 0 ? "Público Alvo..." : "Add..."} className="bg-transparent outline-none flex-1 text-sm text-white min-w-[60px]" />
                        <button onClick={addTag} disabled={!tagInput.trim()} className="text-slate-400 hover:text-white"><Plus size={16}/></button>
                      </div>

                      <select name="goal" value={formData.goal} onChange={handleInputChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none">
                        <option>Venda Direta</option>
                        <option>Captura de Lead</option>
                        <option>Webinar</option>
                        <option>Aplicação</option>
                      </select>

                      {/* Agressividade */}
                      <div className="grid grid-cols-4 gap-1">
                        {(['Baixa', 'Média', 'Alta', 'Extrema'] as AggressivenessLevel[]).map((level) => (
                          <button key={level} onClick={() => { setFormData(prev => ({ ...prev, aggressiveness: level })); if(iteration>1) setIteration(1); }} className={`text-[10px] py-1.5 rounded border ${formData.aggressiveness === level ? 'bg-brand-500 border-brand-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{level}</button>
                        ))}
                      </div>

                      {/* Observações - NOVO CAMPO */}
                      <div className="pt-2">
                        <label className="text-xs text-slate-400 font-semibold mb-1 block flex items-center gap-2">
                           <ShieldAlert className="w-3 h-3 text-brand-500" /> Observações & Restrições
                        </label>
                        <textarea 
                          name="observations"
                          value={formData.observations}
                          onChange={handleInputChange}
                          placeholder="Ex: Não fale de preços. Use gírias cariocas. Foco na dor nas costas..."
                          className="w-full h-20 bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-brand-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Library & History Panel */}
                  <div className="mt-6 pt-6 border-t border-slate-800 h-1/3 flex flex-col">
                    <div className="flex items-center gap-4 mb-3 border-b border-slate-800 pb-2">
                       <button onClick={() => setActiveTab('history')} className={`text-xs font-bold uppercase tracking-wider pb-1 ${activeTab === 'history' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500'}`}>Log Recente</button>
                       <button onClick={() => setActiveTab('saved')} className={`text-xs font-bold uppercase tracking-wider pb-1 flex items-center gap-1 ${activeTab === 'saved' ? 'text-brand-400 border-b-2 border-brand-400' : 'text-slate-500'}`}><Bookmark className="w-3 h-3"/> Aprovados</button>
                       <button onClick={resetSystem} className="ml-auto text-xs text-red-500 hover:underline">Reset</button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {activeTab === 'history' ? (
                        history.length === 0 ? <p className="text-xs text-slate-600 italic">Sem histórico recente.</p> :
                        history.map(item => (
                          <div key={item.id} className="bg-slate-800 p-2 rounded border border-slate-700/50 text-xs text-slate-400">
                             <span className="text-brand-500 font-bold">#{item.iteration}</span> {item.timestamp}
                          </div>
                        ))
                      ) : (
                        savedPrompts.length === 0 ? <p className="text-xs text-slate-600 italic">Nenhum prompt aprovado ainda.</p> :
                        savedPrompts.map(item => (
                           <div key={item.id} className="bg-brand-900/20 border border-brand-500/30 p-2 rounded text-xs">
                              <div className="flex justify-between text-brand-300 font-bold mb-1">
                                <span>{item.timestamp.split(' ')[0]}</span>
                                <button onClick={() => {
                                  navigator.clipboard.writeText(item.fullPrompt);
                                  alert("Copiado!");
                                }} className="hover:text-white"><Copy className="w-3 h-3"/></button>
                              </div>
                              <p className="text-slate-400 line-clamp-2">{item.notes || item.preview}</p>
                           </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Output */}
                <div className="w-full lg:w-2/3 bg-slate-950 flex flex-col relative">
                  {/* Status Bar */}
                  <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}/>
                        <span className="text-xs font-mono font-bold text-slate-300">{isValid ? 'READY TO DEPLOY' : 'WAITING DATA'}</span>
                     </div>
                     <div className="flex items-center gap-4">
                        {/* Approval System */}
                        <div className="flex items-center gap-1 mr-4 border-r border-slate-800 pr-4">
                           <button onClick={handleReject} disabled={!isValid} className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Reprovar (Limpar)"><ThumbsDown className="w-4 h-4"/></button>
                           <button onClick={handleApprove} disabled={!isValid} className="p-1.5 rounded-md text-slate-500 hover:text-green-400 hover:bg-green-500/10 transition-colors" title="Aprovar (Salvar)"><ThumbsUp className="w-4 h-4"/></button>
                        </div>
                        <span className="text-xs font-mono text-slate-500">Fase {iteration}</span>
                     </div>
                  </div>

                  <div className="flex-1 relative p-6">
                    <textarea 
                      readOnly
                      value={currentPrompt}
                      className="w-full h-full bg-slate-900 text-slate-300 font-mono text-xs md:text-sm p-6 rounded-xl border-2 border-slate-800 focus:border-brand-500/50 resize-none outline-none leading-relaxed"
                    />
                    <button 
                      onClick={handleCopy}
                      disabled={!isValid}
                      className="absolute top-10 right-10 p-2 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 hover:bg-brand-600 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
                     <button onClick={handleCopy} disabled={!isValid} className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 disabled:opacity-50">Copiar Prompt</button>
                     <button onClick={handleNextIteration} disabled={!isValid} className="flex-1 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-500 shadow-lg shadow-brand-500/20 disabled:opacity-50 flex items-center justify-center gap-2"><Send className="w-4 h-4"/> Confirmar & Refinar</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};