import React, { useState, useEffect, useRef } from 'react';
import { ClipboardList, CheckSquare, Square, Trash2, CornerDownLeft, CheckCircle2, Copy, Check, ArrowLeft, Download, GripVertical, Pencil, Move } from 'lucide-react';

// --- TIPOS ---
interface NoteItem {
  id: string;
  text: string;
  context: string;
  timestamp: number;
  isCompleted: boolean;
}

interface GlobalNotesProps {
  forcedContext?: string; 
  storageKey?: string;    
  onHide?: () => void;    
}

const CONTEXT_TASKS: Record<string, string[]> = {
    'CoinMaster': [
        "FEATURES: Verificar cor Rubi Pulsante no card Chat VIP ✅",
        "HERO: Checar quebra de linha do H1 em Mobile (iPhone SE)",
        "HERO: Verificar se o texto do gradiente ('Um Único Aplicativo') não está quebrando errado",
        "CHECKOUT: Testar botão 'Vitalício' em telas pequenas (R$ 99,90 pulando linha?)",
        "CARDS: Verificar se Título do Produto x Badge (Novo Método) se sobrepõem",
        "FOOTER: Checar espaçamento vertical entre colunas no Mobile",
        "GERAL: Procurar parágrafos sem 'leading-relaxed' (texto muito grudado)",
        "GERAL: Validar margens (padding) laterais em telas < 360px"
    ],
    'Geral': [
        "Setup Inicial do Projeto",
        "Configurar Cores",
        "Definir Tipografia"
    ]
};

const POSITION_STORAGE_KEY = 'cm_elite_notes_position';

export const GlobalNotes: React.FC<GlobalNotesProps> = ({ 
    forcedContext, 
    storageKey, 
    onHide 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Estados para novas funcionalidades
  const [copied, setCopied] = useState(false);
  const [isImportMode, setIsImportMode] = useState(false);
  const [importText, setImportText] = useState('');

  // --- MODO FOCO / EDIÇÃO ---
  const [focusMode, setFocusMode] = useState<{ active: boolean; id: string | null; text: string }>({
      active: false,
      id: null,
      text: ''
  });
  const [isEditSelectorActive, setIsEditSelectorActive] = useState(false);
  
  // --- MODO REPOSICIONAMENTO ---
  const [isRepositionMode, setIsRepositionMode] = useState(false);

  const lastEnterTime = useRef<number>(0);
  const focusInputRef = useRef<HTMLTextAreaElement>(null);

  // --- ESTADOS DE POSIÇÃO ROBUSTA ---
  const [position, setPosition] = useState(() => {
    if (typeof window !== 'undefined') {
        try {
            const savedPos = localStorage.getItem(POSITION_STORAGE_KEY);
            if (savedPos) {
                const parsed = JSON.parse(savedPos);
                if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) {
                    return { x: parsed.x, y: parsed.y };
                }
            }
        } catch (e) {
            console.error("Erro ao carregar posição inicial", e);
        }
        return { x: 20, y: window.innerHeight - 150 };
    }
    return { x: 20, y: 500 };
  });
  
  const getCurrentContext = () => {
      if (forcedContext) return forcedContext;
      return 'CoinMaster';
  };

  const currentContext = getCurrentContext();
  const effectiveStorageKey = storageKey || `cm_elite_notes_v1_${currentContext}`;

  // --- PERSISTÊNCIA IMEDIATA (LAZY INIT) ---
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem(effectiveStorageKey);
            if (saved) {
                // Carrega EXATAMENTE o que foi salvo anteriormente
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error("Erro ao ler notas", e);
        }
    }
    // ALTERAÇÃO: Não carrega mais defaults automaticamente. Inicia vazio.
    return [];
  });

  // SISTEMA DE BOUNDS CHECKING
  useEffect(() => {
      const validatePosition = () => {
          setPosition(prev => {
              const SAFETY_MARGIN = 10;
              const ICON_SIZE = 60;
              
              const maxX = window.innerWidth - ICON_SIZE;
              const maxY = window.innerHeight - ICON_SIZE;

              let newX = prev.x;
              let newY = prev.y;

              if (newX > maxX) newX = maxX;
              if (newY > maxY) newY = maxY;
              if (newX < SAFETY_MARGIN) newX = SAFETY_MARGIN;
              if (newY < SAFETY_MARGIN) newY = SAFETY_MARGIN;

              if (newX !== prev.x || newY !== prev.y) {
                  return { x: newX, y: newY };
              }
              return prev;
          });
      };

      validatePosition();
      window.addEventListener('resize', validatePosition);
      return () => window.removeEventListener('resize', validatePosition);
  }, []);

  // Salva IMEDIATAMENTE a cada mudança
  useEffect(() => {
    localStorage.setItem(effectiveStorageKey, JSON.stringify(notes));
  }, [notes, effectiveStorageKey]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (focusMode.active || isRepositionMode) return; 

      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
      }
    };
    
    if (isOpen) {
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }
  }, [isOpen, focusMode.active, isRepositionMode]);

  useEffect(() => {
      if (isOpen && focusMode.active && focusInputRef.current) {
          setTimeout(() => {
              focusInputRef.current?.focus();
              const val = focusInputRef.current?.value || '';
              focusInputRef.current?.setSelectionRange(val.length, val.length);
          }, 50);
      }
  }, [focusMode.active, isOpen]);

  const startRepositionMode = () => {
      setIsOpen(false);
      setTimeout(() => setIsRepositionMode(true), 100);
  };

  useEffect(() => {
      if (!isRepositionMode) {
          document.body.style.cursor = 'default';
          return;
      }

      document.body.style.cursor = 'move';

      const handlePlaceClick = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const iconSize = 48; 
          const maxX = window.innerWidth - iconSize; 
          const maxY = window.innerHeight - iconSize;
          
          const newX = Math.min(Math.max(10, e.clientX - (iconSize / 2)), maxX);
          const newY = Math.min(Math.max(10, e.clientY - (iconSize / 2)), maxY);

          setPosition({ x: newX, y: newY });
          localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify({ x: newX, y: newY }));
          
          setIsRepositionMode(false);
      };

      window.addEventListener('click', handlePlaceClick, { capture: true, once: true });
      
      return () => {
          document.body.style.cursor = 'default';
          window.removeEventListener('click', handlePlaceClick, { capture: true });
      };
  }, [isRepositionMode]);

  const startAddingNote = () => {
      setFocusMode({ active: true, id: null, text: '' });
  };

  const startEditingNote = (note: NoteItem) => {
      setFocusMode({ active: true, id: note.id, text: note.text });
      setIsEditSelectorActive(false); 
  };

  const saveFocusNote = () => {
      const text = focusMode.text.trim();
      
      if (!text) {
          setFocusMode({ active: false, id: null, text: '' });
          return;
      }

      if (focusMode.id) {
          setNotes(prev => prev.map(n => n.id === focusMode.id ? { ...n, text: text } : n));
      } else {
          const newNote: NoteItem = {
              id: Date.now().toString(),
              text: text,
              context: currentContext, 
              timestamp: Date.now(),
              isCompleted: false
          };
          setNotes(prev => [newNote, ...prev]);
      }
      setFocusMode({ active: false, id: null, text: '' });
  };

  const handleFocusKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
          const now = Date.now();
          const delta = now - lastEnterTime.current;
          
          if (delta < 400) { 
              e.preventDefault();
              saveFocusNote();
          } else {
              lastEnterTime.current = now;
          }
      }
  };

  const toggleNoteStatus = (id: string) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, isCompleted: !note.isCompleted } : note));
  };

  const deleteNote = (id: string) => setNotes(prev => prev.filter(n => n.id !== id));

  const handleCopyNotes = async () => {
    const listContent = notes.map(note => {
        const check = note.isCompleted ? '[x]' : '[ ]';
        return `- ${check} ${note.text}`;
    }).join('\n');

    const fullText = [
        "**SUAS ATIVIDADES**",
        "",
        "**Se eu devolvi com a caixa marcada é porque está consumado 🤝**",
        "",
        listContent,
        "",
        "**Se eu devolvi com a caixa desmarcada é porque falta 🤏 aqui para perfeição**"
    ].join('\n');

    try {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    } catch (err) {
        console.error('Falha ao copiar', err);
    }
  };

  const handleImportNotes = () => {
    if (!importText.trim()) return;

    const lines = importText.split('\n');
    const newNotes: NoteItem[] = [];
    const taskRegex = /^-\s*\[([ xX])\]\s+(.+)$/;
    
    let currentPendingNote: { text: string; isCompleted: boolean } | null = null;

    lines.forEach((line, idx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine && !currentPendingNote) return;

        const match = trimmedLine.match(taskRegex);
        
        if (match) {
            if (currentPendingNote) {
                newNotes.push({
                    id: Date.now().toString() + idx + Math.random().toString().slice(2, 5),
                    text: currentPendingNote.text,
                    context: currentContext,
                    timestamp: Date.now(),
                    isCompleted: currentPendingNote.isCompleted
                });
            }

            currentPendingNote = {
                text: match[2].trim(),
                isCompleted: match[1].toLowerCase() === 'x'
            };
        } else if (currentPendingNote) {
            if (trimmedLine) {
                 currentPendingNote.text += '\n' + trimmedLine;
            }
        }
    });

    if (currentPendingNote) {
        newNotes.push({
            id: Date.now().toString() + 'last' + Math.random().toString().slice(2, 5),
            text: (currentPendingNote as any).text,
            context: currentContext,
            timestamp: Date.now(),
            isCompleted: (currentPendingNote as any).isCompleted
        });
    }

    setNotes(prev => {
        const existingTexts = new Set(prev.map(n => n.text));
        const uniqueNewNotes = newNotes.filter(n => !existingTexts.has(n.text));
        return [...uniqueNewNotes, ...prev];
    });

    setImportText('');
    setIsImportMode(false);
  };

  const loadDefaults = () => {
      const defaults = CONTEXT_TASKS[currentContext] || CONTEXT_TASKS['Geral'];
      const newNotes = defaults.map((task, index) => ({
          id: Date.now().toString() + index,
          text: task,
          context: currentContext,
          timestamp: Date.now(),
          isCompleted: task.includes('✅')
      }));
      setNotes(prev => {
          const existingTexts = new Set(prev.map(n => n.text));
          const uniqueNewNotes = newNotes.filter(n => !existingTexts.has(n.text));
          return [...uniqueNewNotes, ...prev];
      });
  };

  const pendingCount = notes.filter(n => !n.isCompleted).length;

  return (
    <>
      {isOpen && focusMode.active && (
          <div className="fixed inset-0 z-[10000] flex flex-col justify-end">
              <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={() => setIsOpen(false)} />
              
              <div className="relative z-10 bg-white border-t-2 border-yellow-400 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] animate-slide-up-fade">
                  <div className="max-w-3xl mx-auto flex gap-3 items-end">
                      <textarea
                          ref={focusInputRef}
                          value={focusMode.text}
                          onChange={(e) => setFocusMode(prev => ({ ...prev, text: e.target.value }))}
                          onKeyDown={handleFocusKeyDown}
                          placeholder="Digite sua nota... (Enter x2 salva)"
                          className="w-full bg-gray-50 rounded-xl p-3 text-red-700 font-bold text-lg leading-tight placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-none h-24 max-h-[40vh]"
                      />
                      <button 
                          onClick={saveFocusNote}
                          className="h-12 w-12 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-95 shrink-0 mb-1"
                      >
                          <Check size={28} strokeWidth={3} />
                      </button>
                  </div>
                  <p className="text-center text-[10px] text-gray-400 mt-2 font-medium">
                      Pressione <span className="bg-gray-200 px-1 rounded text-gray-600">Enter</span> para pular linha • <span className="bg-gray-200 px-1 rounded text-gray-600">Enter x2</span> para salvar
                  </p>
              </div>
          </div>
      )}

      <div 
        className={`fixed z-[9999] ${(isOpen && !isRepositionMode) ? 'opacity-0 pointer-events-none transition-opacity duration-300' : ''}`}
        style={{ 
            left: position.x, 
            top: position.y,
            transition: isRepositionMode ? 'none' : 'all 0.3s ease-out'
        }}
        onClick={() => {
            if (!isRepositionMode) setIsOpen(true);
        }}
      >
         <div className={`relative group transition-transform duration-100 cursor-pointer active:scale-95`}>
            {isRepositionMode && (
                <div className="absolute -inset-4 border-2 border-yellow-400 rounded-full animate-ping opacity-50 pointer-events-none"></div>
            )}
            
            <div 
                className={`w-12 h-12 bg-[#ffd700] text-yellow-900 border-2 border-yellow-600/20 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-[#ffed4a] transition-colors ${isRepositionMode ? 'ring-4 ring-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.6)]' : ''}`}
            >
                {isRepositionMode ? <GripVertical size={24} strokeWidth={2.5} className="opacity-50" /> : <ClipboardList size={24} strokeWidth={2.5} />}
                
                {pendingCount > 0 && !isRepositionMode && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white pointer-events-none">
                        {pendingCount}
                    </span>
                )}
            </div>
            {isRepositionMode && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                    Clique onde deseja soltar
                </div>
            )}
         </div>
      </div>

      {isOpen && !isRepositionMode && !focusMode.active && (
        <div className="transition-opacity duration-300 opacity-100">
            <div className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[1px]" onClick={() => setIsOpen(false)}></div>
            
            <div 
                ref={containerRef} 
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] w-[90vw] md:w-[400px] bg-[#fff9c4] rounded-xl shadow-2xl border-2 border-[#ffd700] flex flex-col overflow-hidden h-[500px] font-sans animate-zoom-in"
            >
                <div className="px-3 py-3 flex items-center justify-between shrink-0 bg-[#ffd700] text-yellow-900 shadow-sm z-10">
                    <div className="flex items-center gap-2">
                        {isImportMode ? (
                            <button onClick={() => setIsImportMode(false)} className="hover:bg-yellow-600/20 p-1 rounded transition-colors">
                                <ArrowLeft size={20} strokeWidth={2.5} />
                            </button>
                        ) : (
                            <ClipboardList size={20} strokeWidth={2.5} />
                        )}
                        <span className="font-extrabold text-sm uppercase tracking-wide">
                            {isImportMode ? 'Importar' : (isEditSelectorActive ? 'Selecione p/ Editar' : 'SUAS ATIVIDADES')}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {!isImportMode && (
                            <>
                                <button 
                                    onClick={() => setIsEditSelectorActive(!isEditSelectorActive)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isEditSelectorActive ? 'bg-yellow-800 text-yellow-100 shadow-inner' : 'hover:bg-black/10 text-yellow-900'}`}
                                    title="Editar Notas"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button 
                                    onClick={() => setIsImportMode(true)} 
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors text-yellow-900"
                                    title="Importar"
                                >
                                    <Download size={18} />
                                </button>
                                
                                <button 
                                    onClick={handleCopyNotes} 
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors text-yellow-900 relative"
                                    title="Copiar"
                                >
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>

                                <button 
                                    onClick={startRepositionMode}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 transition-colors text-yellow-900"
                                    title="Mover ícone"
                                >
                                    <Move size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative bg-[#fffde7]">
                    
                    {isImportMode ? (
                        <div className="absolute inset-0 flex flex-col p-3 animate-fade-in">
                            <p className="text-xs text-yellow-800/70 mb-2">
                                Cole suas notas abaixo. Use <code>- [ ]</code> para pendentes e <code>- [x]</code> para concluídas.
                            </p>
                            <textarea 
                                className="flex-1 w-full p-3 text-sm bg-white border border-yellow-300 rounded-lg focus:outline-none focus:border-yellow-500 resize-none font-mono text-gray-700"
                                placeholder="- [ ] Tarefa 1&#10;- [x] Tarefa Concluída&#10;Tarefa Simples"
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                            />
                            <button 
                                onClick={handleImportNotes}
                                className="mt-3 w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-2 rounded-lg shadow-sm border border-yellow-500/20 flex items-center justify-center gap-2 transition-all"
                            >
                                <Download size={16} /> Importar Agora
                            </button>
                        </div>
                    ) : (
                        <div className="absolute inset-0 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-transparent pb-10">
                            {notes.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-yellow-700/40 text-center px-4">
                                    <ClipboardList size={48} className="mb-3 opacity-30" />
                                    <p className="text-sm font-medium mb-3">Sua lista está vazia</p>
                                    <button 
                                        onClick={loadDefaults} 
                                        className="bg-[#ffd700] hover:bg-yellow-400 px-4 py-2 rounded-lg text-xs font-bold text-yellow-900 uppercase transition-colors shadow-sm"
                                    >
                                        Carregar Modelo Padrão
                                    </button>
                                </div>
                            )}
                            {notes.map(note => (
                                <div 
                                    key={note.id} 
                                    className={`p-3 rounded-lg border transition-all 
                                        ${isEditSelectorActive 
                                            ? 'cursor-pointer hover:bg-yellow-100 ring-2 ring-transparent hover:ring-yellow-400/50 scale-[0.99] hover:scale-100 bg-white border-dashed border-yellow-400' 
                                            : note.isCompleted ? 'bg-gray-100 border-gray-200 opacity-60' : 'bg-white border-yellow-200 shadow-sm'
                                        }`}
                                    onClick={() => {
                                        if (isEditSelectorActive) {
                                            startEditingNote(note);
                                        }
                                    }}
                                >
                                    <div className="flex items-start gap-3 pointer-events-none">
                                        <button 
                                            onClick={(e) => {
                                                if (!isEditSelectorActive) {
                                                    e.stopPropagation(); 
                                                    toggleNoteStatus(note.id);
                                                }
                                            }}
                                            className={`mt-0.5 shrink-0 ${note.isCompleted ? 'text-green-600' : 'text-gray-400'} ${!isEditSelectorActive ? 'pointer-events-auto' : ''}`}
                                        >
                                            {isEditSelectorActive ? <Pencil size={18} className="text-yellow-600 animate-pulse" /> : (note.isCompleted ? <CheckSquare size={20} /> : <Square size={20} />)}
                                        </button>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[13px] font-medium leading-tight whitespace-pre-wrap ${note.isCompleted && !isEditSelectorActive ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {!isEditSelectorActive && note.text.length > 50 
                                                    ? `${note.text.substring(0, 50)}...` 
                                                    : note.text}
                                            </p>
                                        </div>
                                        
                                        {!isEditSelectorActive && (
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNote(note.id);
                                                }}
                                                className="text-red-400 hover:text-red-600 pointer-events-auto"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!isImportMode && !isEditSelectorActive && (
                    <div className="p-3 bg-white border-t border-yellow-200 shrink-0">
                        <div className="relative flex items-center">
                            <input 
                                readOnly
                                onFocus={startAddingNote} 
                                onClick={startAddingNote}
                                placeholder="Adicionar tarefa..." 
                                className="w-full pl-3 pr-10 py-3 bg-gray-50 rounded-lg text-sm border focus:outline-none focus:border-yellow-400 text-red-700 font-bold placeholder:font-normal placeholder:text-gray-400 cursor-text" 
                            />
                            <button onClick={startAddingNote} className="absolute right-1.5 w-8 h-8 bg-yellow-400 text-yellow-900 rounded-md flex items-center justify-center hover:bg-yellow-300 transition-colors">
                                <CornerDownLeft size={16} />
                            </button>
                        </div>
                    </div>
                )}
                
                {isEditSelectorActive && (
                     <div className="p-2 bg-yellow-100 border-t border-yellow-300 text-center">
                         <p className="text-xs text-yellow-800 font-bold animate-pulse">Toque em uma tarefa para editar o texto</p>
                     </div>
                )}
            </div>
        </div>
      )}
    </>
  );
};