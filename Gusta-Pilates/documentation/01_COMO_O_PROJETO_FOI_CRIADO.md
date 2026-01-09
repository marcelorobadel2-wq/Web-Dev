# 01 — COMO O PROJETO FOI CRIADO

## 1. FUNDAÇÃO TÉCNICA
O projeto foi inicializado utilizando o ecossistema **Vite** com o template **React + TypeScript**. A escolha visa o desempenho máximo em tempo de desenvolvimento (HMR) e uma build final otimizada para produção.

### Configuração de Ambiente:
- **Linguagem:** TypeScript 5.4+ (Strict Mode).
- **Runtime de Estilização:** Tailwind CSS injetado via CDN no `index.html` com configuração customizada de design system (cores `brand-500`, `brand-accent`, `brand-glow`).
- **Ponto de Entrada:** `index.tsx` que monta o componente `App.tsx` no elemento DOM `#root`.

## 2. ESTRUTURAÇÃO DE PASTAS E ARQUIVOS
A organização segue uma separação clara entre visualização, componentes reutilizáveis e lógica de negócio:

- **`/` (Raiz):** Configurações globais (`tsconfig`, `vite.config`), `index.html`, `index.tsx` e o orquestrador principal `App.tsx`.
- **`components/`:**
    - **Interface Pura:** `Button`, `FadeIn`, `Navbar`.
    - **Conversão & Suporte:** `WhatsAppFab` (Botão Flutuante), `AIHelperBot` (Suporte Automático), `CountDown` (Escassez).
    - **Ferramentas de Gestão:** `DNANemesis` (Engenharia de Prompt), `GlobalNotes` (Gestão de Tarefas In-App).
- **`sections/`:** Segmentos macro da Landing Page. Cada arquivo representa uma "dobra" lógica da página de vendas (`Hero`, `VSL`, `LiveRoom`, etc.).
- **`modules/checkout/`:** Módulo isolado contendo a lógica de domínio, adaptadores de pagamento e gerenciamento de estado via Context API.
- **`documentation/`:** Repositório de arquivos técnicos, incluindo o `CANONICAL_CORE.md` (Governança Lógica) e `FULL_PROJECT_DOCUMENTATION.html`.

## 3. PAPEL DOS ARQUIVOS CHAVE
- **`index.html`:** Gerencia o carregamento de fontes (Inter e Playfair Display) e define a configuração do Tailwind para garantir consistência visual sem arquivos CSS pesados.
- **`App.tsx`:** Atua como o **Layout Orchestrator**. Ele compõe a página importando as seções em ordem linear e envolve toda a aplicação no `CheckoutProvider`.
- **`types.ts`:** Centraliza as interfaces globais para garantir tipagem forte entre componentes e seções.
- **`CANONICAL_CORE.md`:** Arquivo de governança imutável que dita as regras lógicas e restrições do motor de copy `DNANemesis`.

## 4. FLUXO DE IMPORTAÇÃO E COMUNICAÇÃO
1. O `index.tsx` renderiza o `App.tsx`.
2. O `App.tsx` importa e posiciona as `sections/` e os widgets flutuantes (`AIHelperBot`, `WhatsAppFab`, `GlobalNotes`).
3. As `sections/` utilizam os componentes atômicos de `components/`.
4. A `Offer.tsx` e a `CheckoutDemo.tsx` comunicam-se com o `CheckoutContext.tsx` para processar transações.
5. O `CheckoutContext.tsx` utiliza o **Strategy Pattern** para delegar o processamento para um dos `adapters/` (Stripe, PayPal ou Pix).

## 5. DECISÕES ARQUITETURAIS
- **Strategy Pattern no Checkout:** Permite adicionar novos gateways de pagamento apenas criando um novo adaptador que siga a interface `IPaymentGateway`, sem alterar o core do sistema.
- **Component Composition:** Seções são construídas injetando componentes de UI, permitindo que alterações de design no `Button.tsx` reflitam instantaneamente em toda a página.
- **Stateful Governance & LocalStorage:** O componente `DNANemesis` e `GlobalNotes` utilizam persistência local para manter o estado de desenvolvimento e tarefas, criando uma "IDE dentro do Site".

## 6. ORDEM CRONOLÓGICA DE CONSTRUÇÃO
1. Configuração do Boilerplate Vite/React/TS.
2. Definição do Design System no `index.html`.
3. Desenvolvimento dos componentes base (`Button`, `FadeIn`).
4. Implementação das seções de UI (`Hero`, `VSL`, `Problem`, `Mechanism`).
5. Engenharia do Módulo de Checkout (Domínio -> Adapters -> Context -> UI).
6. Implementação de widgets de conversão (`WhatsAppFab`, `AIHelperBot`, `LiveRoom`).
7. Acoplamento de ferramentas de produtividade (`DNANemesis`, `GlobalNotes`).
8. Refinamento de animações e otimização de responsividade mobile.