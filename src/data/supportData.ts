export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'account' | 'discovery' | 'boards' | 'privacy' | 'cro';
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'discovery',
    question: 'Como funciona a descoberta visual no Inspiria?',
    answer: 'O Inspiria organiza milhões de ideias através de um modelo "Scroll-to-Wall" baseado no Efeito Zeigarnik e em grelhas dinâmicas tipo masonry. Basta escolher ou digitar um interesse (como "ideia para o jantar" ou "look de outono") para aceder a um feed infinito focado 100% no conteúdo visual, sem ruído de notícias ou redes sociais tradicionais.'
  },
  {
    id: 'faq-2',
    category: 'boards',
    question: 'Como crio e organizo as minhas pastas de ideias?',
    answer: 'Ao passar o cursor ou tocar em qualquer ideia visual, verá o botão "Guardar". Pode criar novas pastas temáticas (ex: "Jantares Rápidos", "Decoração Nórdica") e guardar ideias com 1 clique para voltar a vê-las e aplicá-las mais tarde.'
  },
  {
    id: 'faq-3',
    category: 'account',
    question: 'Por que o Inspiria utiliza "Continuar com o Google" em vez de um cadastro longo?',
    answer: 'Adotamos o princípio de fricção zero de CRO (Conversion Rate Optimization). O botão "Continuar" reduz a barreira mental de preenchimento de formulários em mais de 40%, permitindo que aceda instantaneamente à sua conta através de Single Sign-On seguro.'
  },
  {
    id: 'faq-4',
    category: 'privacy',
    question: 'Os meus dados e pastas guardadas estão seguros?',
    answer: 'Sim! As suas preferências e pastas são guardadas de forma segura. Pode manter as suas pastas públicas para inspirar outros utilizadores ou configurá-las como privadas para planeamento pessoal.'
  },
  {
    id: 'faq-5',
    category: 'cro',
    question: 'O que significa a fórmula dos 4 verbos: "Veja, faça, experimente, compre"?',
    answer: 'É a nossa arquitetura psicológica de conversão gradual: "Veja" (descoberta passiva de topo de funil), "Faça" (acesso a instruções e receitas), "Experimente" (validação e prática no dia a dia) e "Compre" (aquisição direta e comércio curado sem atrito).'
  },
  {
    id: 'faq-6',
    category: 'account',
    question: 'Como posso recuperar a minha palavra-passe ou aceder com outro e-mail?',
    answer: 'Na janela de acesso, selecione "Continuar com o e-mail" e clique na opção de recuperação. Receberá de imediato um link de verificação no seu correio eletrónico.'
  },
  {
    id: 'faq-7',
    category: 'discovery',
    question: 'Posso usar o Inspiria Copilot para tirar dúvidas ou pedir ideias?',
    answer: 'Sim! O Inspiria Copilot é o nosso assistente inteligente (disponível no topo ou no canto inferior direito). Pode pedir receitas de última hora, dicas de decoração escandinava ou explorar a metodologia de conversão da nossa plataforma.'
  }
];

export interface SupportTicket {
  id: string;
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
  status: 'sent' | 'pending';
  date: string;
}
