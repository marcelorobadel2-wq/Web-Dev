import { ReactNode } from 'react';

export interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  role: string;
  image: string;
  quote: string;
  revenue: string;
}

export interface BonusItem {
  title: string;
  value: string;
  description: string;
}

// --- BOT MANAGER TYPES ---

export type BotActionType = 'text' | 'scroll' | 'link' | 'whatsapp';

export interface BotQuestion {
  id: number;
  question: string; // O texto do botão que o usuário clica
  answer: string;   // A resposta do bot
  actionType: BotActionType; // O tipo de CTA que aparece após a resposta
  actionLabel?: string; // Texto do botão de ação (ex: "Ver Oferta")
  actionValue?: string; // O destino (ex: "#offer", "https://wa.me/...")
}

export interface BotIdentity {
  botName: string;
  avatarUrl: string;
  welcomeMessage: string;
  companyName: string;
}

export interface BotBehavior {
  autoOpenSeconds: number; // 0 = desativado
  soundEnabled: boolean;
  showNotificationBadge: boolean;
}

export interface BotConfig {
  identity: BotIdentity;
  behavior: BotBehavior;
  questions: BotQuestion[];
  isActive: boolean;
}