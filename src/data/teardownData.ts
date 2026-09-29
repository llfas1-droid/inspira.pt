import { DynamicCategory, PsychologicalTrigger, TeardownSection } from '../types';

export const HERO_CATEGORIES: DynamicCategory[] = [
  {
    id: 'dinner',
    phrase: 'ideia para o jantar',
    color: '#C32F27',
    bgLight: '#FFF4F2',
    accent: '#8E1711',
    emotionalTrigger: 'Apetite & Conforto Caseiro',
    searchIntent: 'Procurar refeições rápidas, saudáveis ou impressionantes para a família sem fadiga de decisão.',
    pins: [
      {
        id: 'p1',
        title: 'Fettuccine artesanal com molho pomodoro e manjericão fresco',
        category: 'dinner',
        imageUrl: '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg',
        author: 'Receitas da Nonna',
        savesCount: '48.2k',
        aspectRatio: 'tall',
        tag: 'Massa Fresca',
        sourceUrl: 'cozinhagourmet.pt'
      },
      {
        id: 'p2',
        title: 'Salmão grelhado com crosta de ervas e puré de batata-doce',
        category: 'dinner',
        imageUrl: '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg',
        author: 'Cozinha Criativa',
        savesCount: '32.1k',
        aspectRatio: 'medium',
        tag: 'Jantar Rápido'
      },
      {
        id: 'p3',
        title: 'Tábua de queijos curados portugueses com nozes e mel silvestre',
        category: 'dinner',
        imageUrl: '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg',
        author: 'Sabores Lusos',
        savesCount: '19.4k',
        aspectRatio: 'short',
        tag: 'Entrada'
      },
      {
        id: 'p4',
        title: 'Risoto de cogumelos selvagens com azeite trufado',
        category: 'dinner',
        imageUrl: '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg',
        author: 'Chef Miguel',
        savesCount: '64.8k',
        aspectRatio: 'tall',
        tag: 'Gourmet'
      },
      {
        id: 'p5',
        title: 'Bowl mediterrânico com quinoa crocante e grão temperado',
        category: 'dinner',
        imageUrl: '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg',
        author: 'Vida Saudável',
        savesCount: '27.3k',
        aspectRatio: 'medium',
        tag: 'Healthy'
      }
    ]
  },
  {
    id: 'decor',
    phrase: 'ideia de decoração',
    color: '#0F7173',
    bgLight: '#E8F7F7',
    accent: '#094B4D',
    emotionalTrigger: 'Paz, Harmonia & Refúgio Pessoal',
    searchIntent: 'Transformar espaços residenciais em ambientes acolhedores, estéticos e organizados.',
    pins: [
      {
        id: 'p6',
        title: 'Sala de estar minimalista nórdica com sofá de linho cru',
        category: 'decor',
        imageUrl: '/src/assets/images/pinterest_home_decor_1790688484395.jpg',
        author: 'Studio Lisboa Arquitetura',
        savesCount: '92.4k',
        aspectRatio: 'tall',
        tag: 'Design Nórdico',
        sourceUrl: 'studiolisboa.pt'
      },
      {
        id: 'p7',
        title: 'Cantinho de leitura com oliveira anã em vaso de terracota',
        category: 'decor',
        imageUrl: '/src/assets/images/pinterest_home_decor_1790688484395.jpg',
        author: 'Casa & Conforto',
        savesCount: '41.0k',
        aspectRatio: 'medium',
        tag: 'Plantas em Casa'
      },
      {
        id: 'p8',
        title: 'Quadro botânico abstrato com moldura fina em carvalho natural',
        category: 'decor',
        imageUrl: '/src/assets/images/pinterest_home_decor_1790688484395.jpg',
        author: 'Galeria Minimal',
        savesCount: '15.9k',
        aspectRatio: 'short',
        tag: 'Arte de Parede'
      },
      {
        id: 'p9',
        title: 'Cozinha aberta com bancada em mármore e iluminação suspensa',
        category: 'decor',
        imageUrl: '/src/assets/images/pinterest_home_decor_1790688484395.jpg',
        author: 'Interior Trends',
        savesCount: '78.2k',
        aspectRatio: 'tall',
        tag: 'Cozinha'
      },
      {
        id: 'p10',
        title: 'Prateleiras flutuantes com cerâmicas rústicas e livros de arte',
        category: 'decor',
        imageUrl: '/src/assets/images/pinterest_home_decor_1790688484395.jpg',
        author: 'Espaços Vivos',
        savesCount: '34.6k',
        aspectRatio: 'medium',
        tag: 'Organização'
      }
    ]
  },
  {
    id: 'outfit',
    phrase: 'look de outono',
    color: '#B85D19',
    bgLight: '#FEF5EE',
    accent: '#7E3B09',
    emotionalTrigger: 'Autoestima, Elegância & Identidade',
    searchIntent: 'Inspirar combinações de vestuário prontas para a nova estação com peças versáteis.',
    pins: [
      {
        id: 'p11',
        title: 'Casaco de caxemira camel sobre camisola de malha cru e botas',
        category: 'outfit',
        imageUrl: '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg',
        author: 'Moda Urbana PT',
        savesCount: '115.3k',
        aspectRatio: 'tall',
        tag: 'Capsule Wardrobe',
        sourceUrl: 'streetstyleportugal.com'
      },
      {
        id: 'p12',
        title: 'Cachecol xadrez oversize em lã com calças plissadas',
        category: 'outfit',
        imageUrl: '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg',
        author: 'Estilo & Simplicidade',
        savesCount: '53.7k',
        aspectRatio: 'medium',
        tag: 'Acessórios'
      },
      {
        id: 'p13',
        title: 'Botins em pele castanha com sola tratorada e meias quentes',
        category: 'outfit',
        imageUrl: '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg',
        author: 'Calçado & Moda',
        savesCount: '28.1k',
        aspectRatio: 'short',
        tag: 'Calçado'
      },
      {
        id: 'p14',
        title: 'Blazer estruturado em sarja espiga com jeans de corte reto',
        category: 'outfit',
        imageUrl: '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg',
        author: 'Sofia Alfaiataria',
        savesCount: '69.4k',
        aspectRatio: 'tall',
        tag: 'Smart Casual'
      },
      {
        id: 'p15',
        title: 'Sobretudo comprido em tons terra para dias amenos de Lisboa',
        category: 'outfit',
        imageUrl: '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg',
        author: 'Outono em Lisboa',
        savesCount: '44.9k',
        aspectRatio: 'medium',
        tag: 'Outerwear'
      }
    ]
  },
  {
    id: 'diy',
    phrase: 'ideia de bricolage',
    color: '#3F6C51',
    bgLight: '#F2F8F4',
    accent: '#234431',
    emotionalTrigger: 'Criatividade Prática & Sentimento de Conquista',
    searchIntent: 'Aprender técnicas manuais passo a passo para criar ou restaurar objetos únicos.',
    pins: [
      {
        id: 'p16',
        title: 'Cerâmica manual em grés com acabamento orgânico e esmalte fosco',
        category: 'diy',
        imageUrl: '/src/assets/images/pinterest_diy_craft_1790688510397.jpg',
        author: 'Oficina do Barro',
        savesCount: '87.1k',
        aspectRatio: 'tall',
        tag: 'Cerâmica DIY',
        sourceUrl: 'oficinadebarro.pt'
      },
      {
        id: 'p17',
        title: 'Pequena jarra em terracota com arranjo de eucalipto seco',
        category: 'diy',
        imageUrl: '/src/assets/images/pinterest_diy_craft_1790688510397.jpg',
        author: 'Manual & Terra',
        savesCount: '36.8k',
        aspectRatio: 'medium',
        tag: 'Decoração Rústica'
      },
      {
        id: 'p18',
        title: 'Bancada de marceneiro com ferramentas manuais de talha em carvalho',
        category: 'diy',
        imageUrl: '/src/assets/images/pinterest_diy_craft_1790688510397.jpg',
        author: 'Marcenaria Criativa',
        savesCount: '21.5k',
        aspectRatio: 'short',
        tag: 'Madeira'
      },
      {
        id: 'p19',
        title: 'Vela artesanal de cera de soja em recipiente de barro moldado',
        category: 'diy',
        imageUrl: '/src/assets/images/pinterest_diy_craft_1790688510397.jpg',
        author: 'Aromas & Velas',
        savesCount: '58.3k',
        aspectRatio: 'tall',
        tag: 'Velas Caseiras'
      },
      {
        id: 'p20',
        title: 'Macramé de parede moderno com cordão cru e ramo apanhado na praia',
        category: 'diy',
        imageUrl: '/src/assets/images/pinterest_diy_craft_1790688510397.jpg',
        author: 'Fios & Nós',
        savesCount: '49.0k',
        aspectRatio: 'medium',
        tag: 'Artesanato Têxtil'
      }
    ]
  }
];

export const TEARDOWN_SECTIONS: TeardownSection[] = [
  {
    id: 'hero',
    title: 'Seção 1: O Herói Dinâmico (Above the Fold)',
    rawTextPt: 'Encontre a sua próxima [ideia para o jantar / ideia de decoração / look de outono]',
    rawTextEn: 'Find your next [dinner idea / home decor idea / autumn outfit]',
    functionalGoal: 'Demonstração de valor imediata. Responde "Para que serve este site?" em menos de 3 segundos sem forçar a leitura de um parágrafo longo.',
    primaryEmotionalDriver: 'Curiosidade, inspiração espontânea e aspiração pessoal.',
    psychologicalMechanics: [
      'Dynamic Keyword Insertion: Personaliza o benefício para nichos distintos (culinária, moda, casa) na mesma dobra.',
      'Show, Don\'t Tell: A grelha em cascata substitui 500 palavras de texto explicativo com imagens estimulantes.',
      'Future Pacing: A palavra "próxima" pressupõe que o utilizador já está numa jornada contínua e o Inspiria é o acelerador.'
    ],
    keyTakeaways: [
      'Redução drástica do Bounce Rate através de movimento visual suave (floating masonry).',
      'Ativação multissegmento sem fragmentar o design em landing pages separadas.',
      'Eliminação total de termos técnicos e buzzwords de motor de busca.'
    ]
  },
  {
    id: 'benefit1',
    title: 'Seção 2: O Mecanismo Central (Benefício 1)',
    rawTextPt: 'Guarde as ideias de que gosta. Colecione as suas imagens favoritas para voltar a vê-las mais tarde.',
    rawTextEn: 'Save the ideas you like. Collect your favorite images to revisit them later.',
    functionalGoal: 'Explicar a funcionalidade primária da plataforma (Colecionar / Guardar em Pastas) convertida num benefício tangível de longo prazo.',
    primaryEmotionalDriver: 'Organização, posse psicológica e aversão à perda de boas ideias.',
    psychologicalMechanics: [
      'Loss Aversion (Kahneman & Tversky): O medo de esquecer aquela receita ou aquele candeeiro bonito compele a ação de guardar.',
      'Endowment Effect: Ao criar uma pasta ("Jantares Rápidos"), o utilizador sente propriedade imediata antes mesmo de ter executado a receita.',
      'Verbos no Imperativo Suave: "Guarde", "Colecione" sugerem prazer pessoal e não trabalho burocrático.'
    ],
    keyTakeaways: [
      'Foco na utilidade futura ("voltar a vê-las mais tarde") em vez da complexidade da ferramenta.',
      'Desmistifica o conceito de coleções visuais para um público amplo sem recorrer a jargão corporativo.'
    ]
  },
  {
    id: 'benefit2',
    title: 'Seção 3: O Resultado Concreto (Benefício 2)',
    rawTextPt: 'Veja, faça, experimente, compre. As melhores ideias da internet estão no Inspiria.',
    rawTextEn: 'See it, make it, try it, buy it. The best ideas on the internet are on Inspiria.',
    functionalGoal: 'Transição do utilizador de mero espectador passivo para agente com intenção ativa. Reenquadra a plataforma como motor de estilo de vida e comércio curado.',
    primaryEmotionalDriver: 'Capacitação pessoal, realização prática e consumo curado.',
    psychologicalMechanics: [
      'Clímax Tetrádico Gradual: A cadência "Veja → Faça → Experimente → Compre" mapeia toda a jornada de ação humana.',
      'Autoridade Social Absoluta: "As melhores ideias da internet" estabelece supremacia aspiracional sobre redes sociais convencionais.',
      'Monetização Invisível: Introduz o ato de "comprar" como uma continuação natural da criatividade, não como publicidade intrusiva.'
    ],
    keyTakeaways: [
      'Ponte de conversão entre visualização estética e comércio digital (social commerce).',
      'Frases com 3 a 7 palavras maximizam retenção mnemónica e ritmo de leitura.'
    ]
  },
  {
    id: 'auth_modal',
    title: 'Seção 4: A Parede de Aquisição (Sticky Auth Modal)',
    rawTextPt: 'Bem-vindo(a) ao Inspiria. Encontre novas ideias para experimentar.',
    rawTextEn: 'Welcome to Inspiria. Find new ideas to try.',
    functionalGoal: 'Criação de conta com fricção zero via Single Sign-On (Google / Facebook), disparada no momento ideal da intenção.',
    primaryEmotionalDriver: 'Sensação de pertença imediata e urgência de acesso aos conteúdos que viu na tela.',
    psychologicalMechanics: [
      'Presumptive Close ("Bem-vindo(a)"): Acolhe o visitante antes mesmo de este fornecer o e-mail, assumindo o sucesso da adesão.',
      'Micro-Copy "Continuar" vs "Registe-se": "Continuar" transmite continuidade de um passo já iniciado, enquanto "Registe-se" evoca burocracia.',
      'Scroll-to-Wall Timing: A modal surge quando o scroll ultrapassa a dobra ou quando o utilizador tenta guardar uma ideia.'
    ],
    keyTakeaways: [
      'Eliminação de barreiras cognitivas: 1 clique via Google SSO.',
      'A promessa é reafirmada no modal ("Encontre novas ideias para experimentar").'
    ]
  }
];

export const PSYCHOLOGICAL_TRIGGERS: PsychologicalTrigger[] = [
  {
    id: 'zeigarnik',
    name: 'Efeito Zeigarnik (Open Loops)',
    portugueseName: 'Gatilho de Ciclos Abertos',
    description: 'O cérebro humano tem aversão a tarefas ou informações incompletas. Imagens cortadas intencionalmente na borda inferior da tela forçam o utilizador a fazer scroll para ver o resto.',
    pinterestApplication: 'Os cartões da grelha de masonry são cortados pela metade na linha de dobra (fold). O utilizador faz scroll naturalmente para completar a imagem visual, o que ativa o gatilho da modal de registo.',
    croImpact: '+38% na taxa de scroll abaixo da dobra em testes de interface visual.',
    behavioralPrinciple: 'Incompleteness creates tension; scrolling resolves tension.',
    iconName: 'Eye'
  },
  {
    id: 'implicit_proof',
    name: 'Prova Social Implícita',
    portugueseName: 'Volume Visível Curado',
    description: 'Em vez de usar emblemas artificiais como "Junte-se a 400 milhões de utilizadores", o Inspiria mostra milhares de itens belíssimos organizados com requinte.',
    pinterestApplication: 'A densidade e o acabamento dos itens provam instantaneamente que a plataforma está viva, curada por pessoas reais e repleta de valor pronto a consumir.',
    croImpact: 'Evita a fadiga de ceticismo do utilizador contra números corporativos hiperbólicos.',
    behavioralPrinciple: 'Show vitality through content density, not claimed metrics.',
    iconName: 'Sparkles'
  },
  {
    id: 'future_pacing',
    name: 'Future Pacing (Projeção no Futuro)',
    portugueseName: 'Ritmo Antecipado',
    description: 'A palavra "Próxima" ("Encontre a sua próxima...") induz a mente do leitor a assumir que o ato de ter novas ideias já é um hábito contínuo na sua vida.',
    pinterestApplication: 'Posiciona o Inspiria não como uma novidade que exige esforço de aprendizagem, mas como o instrumento natural para o que o utilizador já planeava fazer hoje à noite.',
    croImpact: '+22% na percepção de relevância pessoal imediata da proposta de valor.',
    behavioralPrinciple: 'Frame adoption as the next logical step in an existing routine.',
    iconName: 'Compass'
  },
  {
    id: 'loss_aversion',
    name: 'Aversão à Perda (Loss Aversion)',
    portugueseName: 'Prevenção de Esquecimento',
    description: 'A dor psicológica de perder uma ideia brilhante encontrada na web é duas vezes mais intensa do que o prazer de encontrar uma ideia qualquer.',
    pinterestApplication: '"Guarde as ideias de que gosta. Colecione as suas imagens favoritas para voltar a vê-las mais tarde." Garante que a inspiração nunca mais se perde no caos da internet.',
    croImpact: 'Transforma o ato de guardar em seguro cognitivo contra a perda de ideias.',
    behavioralPrinciple: 'People fight harder to avoid losing value than to gain new value.',
    iconName: 'Bookmark'
  }
];

export const COPY_FORMULAS = [
  {
    name: 'Fórmula de Inserção Dinâmica Inspiria',
    syntax: 'Encontre a sua próxima [Desejo de Nicho Altamente Específico]',
    syntaxEn: 'Find your next [Specific Niche Desire]',
    whyItWorks: 'Segmenta múltiplos perfis de clientes instantaneamente no mesmo espaço nobre, disparando relevância personalizada sem poluir a interface.',
    examplesPt: [
      'Encontre a sua próxima ideia para o jantar',
      'Encontre o seu próximo destino de fim de semana',
      'Encontre a sua próxima rotina matinal produtiva',
      'Encontre o seu próximo projeto de decoração acolhedor'
    ]
  },
  {
    name: 'A Regra dos 4 Verbos de Ação Gradual',
    syntax: '[Verbo de Descoberta], [Verbo de Criação], [Verbo de Teste], [Verbo de Aquisição]',
    syntaxEn: 'See it, make it, try it, buy it',
    whyItWorks: 'Guia o cérebro através dos 4 degraus naturais de comprometimento psicológico: Curiosidade → Produção → Validação → Decisão.',
    examplesPt: [
      'Veja, faça, experimente, compre. (Inspiria)',
      'Descubra, aprenda, pratique, domine. (Educação)',
      'Inspire-se, planeie, reserve, viva. (Turismo)'
    ]
  },
  {
    name: 'A Fórmula do "Continuar" vs "Registe-se"',
    syntax: 'Continuar com [Provedor SSO] vs Criar conta nova',
    whyItWorks: 'A palavra "Continuar" sinaliza progresso já em curso (menor carga cognitiva), enquanto "Registe-se" sugere o início de uma tarefa burocrática exaustiva.',
    examplesPt: [
      'Continuar com o Google (Redução média de atrito: 43%)',
      'Continuar com o Facebook',
      'Continuar com o e-mail'
    ]
  }
];

export const AB_EXPERIMENTS = [
  {
    id: 'exp1',
    element: 'Headline Principal',
    variantA: 'O Maior Motor de Descoberta Visual do Mundo',
    variantB: 'Encontre a sua próxima ideia para o jantar',
    winner: 'Variant B (+64% retenção na dobra)',
    insight: 'Fórmulas orientadas a utilidade cotidiana vencem declarações corporativas institucionais.'
  },
  {
    id: 'exp2',
    element: 'Botão de Single Sign-On (SSO)',
    variantA: 'Registe-se com o Google',
    variantB: 'Continuar com o Google',
    winner: 'Variant B (+41% conclusão de signup)',
    insight: '"Continuar" reduz a barreira psicológica de compromisso formal.'
  },
  {
    id: 'exp3',
    element: 'Trigger do Modal de Autenticação',
    variantA: 'Popup imediato no primeiro segundo de visita',
    variantB: 'Scroll após o corte dos itens + clique de "Guardar"',
    winner: 'Variant B (+89% taxa de conversão final)',
    insight: 'A intenção induzida pelo Efeito Zeigarnik converte 4x mais do que a interrupção precoce.'
  }
];
