
import React, { useState } from 'react';
import { Play, ArrowDown } from 'lucide-react';
import { FadeIn } from '../components/FadeIn';

export const VSL: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl relative group">
            
            {/* 1. ÁREA DO VÍDEO */}
            <div className="relative aspect-video bg-black">
              {!isPlaying ? (
                /* ESTADO INICIAL: Thumbnail + Botão Play */
                <button 
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 w-full h-full group flex items-center justify-center relative z-10 cursor-pointer"
                >
                  {/* Imagem Clara de Capa */}
                  <img 
                    src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop" 
                    alt="Capa do Vídeo Gusta Pilates" 
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Overlay Escuro Suave para destacar o botão */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300"></div>

                  {/* Botão Play Centralizado */}
                  <div className="relative z-20 w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-full backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(14,165,233,0.6)]">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-brand-500 rounded-full flex items-center justify-center shadow-lg pl-1">
                      <Play className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
                    </div>
                  </div>
                  
                  {/* Texto "Clique para assistir" discreto */}
                  <span className="absolute bottom-10 text-white/80 text-sm font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Clique para iniciar
                  </span>
                </button>
              ) : (
                /* ESTADO TOCANDO: Player de Vídeo */
                <video 
                  className="w-full h-full object-cover"
                  autoPlay
                  controls
                  src="https://videos.pexels.com/video-files/6111110/6111110-hd_1920_1080_25fps.mp4"
                >
                  Seu navegador não suporta a tag de vídeo.
                </video>
              )}
            </div>

            {/* 2. ÁREA DE TEXTO (FORA DO VÍDEO) */}
            <div className="p-8 md:p-10 bg-slate-900 border-t border-slate-800">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="bg-brand-500/10 text-brand-500 text-xs font-bold px-3 py-1 rounded-full border border-brand-500/20 uppercase tracking-wide">
                                Aula Experimental
                            </span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                Vídeo Importante
                            </span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-2">
                            O Protocolo de Regeneração
                        </h3>
                        
                        <p className="text-slate-400 leading-relaxed max-w-2xl mb-4">
                           "Não importa sua idade, lesão ou fase da vida. Importa quem você quer se tornar."
                        </p>

                        <button 
                          onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
                          className="flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors group"
                        >
                          <ArrowDown className="w-3 h-3 group-hover:translate-y-1 transition-transform" />
                          Ver oferta de acesso imediato
                        </button>
                    </div>

                    {/* Botão de Ação Rápida */}
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                         <button 
                            onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700 text-sm"
                         >
                            Pular vídeo e ver oferta &rarr;
                         </button>
                    </div>
                </div>
            </div>

          </div>
        </FadeIn>
        
        <div className="text-center mt-8">
            <p className="text-slate-500 text-xs uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-brand-500 rounded-full"></span>
              Assista antes que saia do ar
            </p>
        </div>
      </div>
    </section>
  );
};
