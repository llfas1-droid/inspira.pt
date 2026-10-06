const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateProjectReportPDF() {
  const outputDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'relatorio-projeto-inspira.pdf');
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    info: {
      Title: 'Inspira Portugal - Relatório Executivo e Técnico do Projeto',
      Author: 'Inspira Portugal',
      Subject: 'Resumo Executivo, Funcionalidades, Arquitetura Técnica e Desafios',
      Keywords: 'Inspira, CRO, Gemini, Firestore, Google Calendar, React, TypeScript',
    },
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryRed = '#E60023';
  const darkSlate = '#0F172A';
  const textBody = '#334155';
  const textMuted = '#64748B';
  const bgLight = '#F8FAFC';
  const borderLight = '#E2E8F0';

  // --- HEADER / BANNER ---
  doc
    .rect(50, 45, 495, 65)
    .fillAndStroke(bgLight, borderLight);

  // Logo Icon
  doc
    .roundedRect(65, 57, 40, 40, 10)
    .fill(primaryRed);
  
  doc
    .fillColor('#FFFFFF')
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('I', 79, 66);

  // Title in header
  doc
    .fillColor(darkSlate)
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Inspira Portugal · Relatório do Projeto', 120, 58);

  doc
    .fillColor(textMuted)
    .fontSize(10)
    .font('Helvetica')
    .text('Resumo Executivo, Arquitetura Técnica, Desafios & FAQ', 120, 78);

  doc
    .fontSize(9)
    .fillColor(primaryRed)
    .text('pt.inspira.com', 460, 58, { align: 'right' });

  doc.moveDown(4.5);

  // Helper for Section Titles
  function addSectionTitle(title, number) {
    doc.moveDown(0.8);
    const y = doc.y;
    doc
      .rect(50, y, 4, 18)
      .fill(primaryRed);
    
    doc
      .fillColor(darkSlate)
      .font('Helvetica-Bold')
      .fontSize(13)
      .text(`${number}. ${title}`, 62, y + 2);
    doc.moveDown(0.6);
  }

  function addSubTitle(subtitle) {
    doc
      .fillColor(primaryRed)
      .font('Helvetica-Bold')
      .fontSize(10.5)
      .text(subtitle);
    doc.moveDown(0.3);
  }

  function addParagraph(text) {
    doc
      .fillColor(textBody)
      .font('Helvetica')
      .fontSize(9.5)
      .lineGap(3)
      .text(text, { align: 'justify' });
    doc.moveDown(0.6);
  }

  function addBullet(label, text) {
    doc
      .fillColor(darkSlate)
      .font('Helvetica-Bold')
      .fontSize(9.5)
      .text(`• ${label}: `, { continued: true })
      .fillColor(textBody)
      .font('Helvetica')
      .text(text, { align: 'justify', lineGap: 2 });
    doc.moveDown(0.4);
  }

  // --- SEÇÃO 1 ---
  addSectionTitle('Resumo Executivo & Visão Geral', '1');

  addBullet('Nome do Produto e Empresa', 'Inspira / Inspira Portugal (pt.inspira.com).');
  addBullet('Descrição do Produto/Serviço', 'O Inspira é uma plataforma de curadoria visual e orçamentação comercial inteligente. Combina uma experiência fluida de descoberta visual (focada no mercado português e enriquecida com auditoria de CRO) com um motor automatizado de pedidos de propostas comerciais apoiado por IA (Google Gemini) e integração oficial com o Google Calendar para agendamento de reuniões executivas e sessões de alinhamento.');
  addBullet('Segmento de Clientes (Público-Alvo)', '1) Consumidores e entusiastas digitais em busca de ideias de decoração, estilo pessoal e receitas sem ruído de redes sociais; 2) PMEs, marcas e criadores que solicitam propostas de serviços criativos e curadoria; 3) Especialistas de produto, marketing e CRO que analisam padrões de retenção e conversão.');

  // --- SEÇÃO 2 ---
  addSectionTitle('Funcionalidades Principais (Features)', '2');

  addSubTitle('2.1 Pedido de Propostas com IA (Gemini API) & Catálogo Comercial');
  addParagraph('Permite ao utilizador descrever as suas necessidades comerciais em linguagem natural livre. O modelo Gemini 3.8 Flash analisa e extrai structured data (JSON Schema), mapeia os itens para o catálogo oficial da base de dados e calcula o valor total sem IVA com validade de 15 dias. As propostas geradas recebem um token único de consulta pública encriptado.');

  addSubTitle('2.2 Integração com Google Calendar API v3 (Workspace OAuth)');
  addParagraph('Sincronização bidirecional em tempo real com a agenda Google do utilizador. Permite marcar sessões de alinhamento de propostas e consultorias com geração de links do Google Meet. Inclui diálogo obrigatório de confirmação antes de qualquer ação de modificação ou eliminação, e proteção do access token exclusivamente em memória.');

  addSubTitle('2.3 Área de Administração & Gestão de Catálogo (RBAC Firestore)');
  addParagraph('Painel reservado a administradores autenticados via Firebase Auth (Google Sign-In). Disponibiliza auditoria de pedidos submetidos, reprocessamento de inteligência artificial, resolução manual de pedidos ambíguos, gestão do preçário comercial e reenvio de notificações automáticas via Resend.');

  addSubTitle('2.4 Auditoria CRO, Modo Raio-X & Navegação Fluida (Framer Motion)');
  addParagraph('Interface com transições suaves (fade-in) operadas por Framer Motion através de AnimatePresence, histórico URL sincronizado (/teardown, /suporte, /calendario, /admin) e modo de inspeção visual com métricas comportamentais.');

  // Page 2
  doc.addPage();

  // --- SEÇÃO 3 ---
  addSectionTitle('Detalhes de Implementação e Desafios', '3');

  addSubTitle('3.1 Arquitetura Técnica & Stack Utilizada');
  addBullet('Frontend SPA', 'React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React e Framer Motion (para transições orquestradas de entrada/saída).');
  addBullet('Backend API', 'Node.js, Express e TypeScript (tsx), implementando rotas RESTful para catálogo, pedidos, propostas e proxy de administração.');
  addBullet('Base de Dados & Auth', 'Google Cloud Firestore (coleções: catalogo, pedidos, propostas) com regras de segurança ABAC em firestore.rules e Firebase Authentication.');
  addBullet('Inteligência Artificial', 'SDK oficial @google/genai com o modelo gemini-3.8-flash, configurado com resposta estruturada estrita para evitar alucinações de preços.');
  addBullet('Serviços de Terceiros', 'Google Calendar API v3 via OAuth 2.0 client-side e biblioteca Resend para expedição de notificações transacionais por correio eletrónico.');

  addSubTitle('3.2 Principais Desafios Técnicos e Soluções Adotadas');
  addBullet('Resolução do Erro Firestore (5 NOT_FOUND)', 'Durante a conexão inicial, o cliente gRPC falhava com o código 5 NOT_FOUND devido à ausência de base de dados provisionada no projeto do Cloud Run. A situação foi corrigida executando o provisionamento oficial via RPC ProvisionFirebase na região europe-west2, registando o identificador dedicado no firebase-applet-config.json e efetuando o seeding automático de dados.');
  addBullet('Segurança e OAuth em Ambientes com iFrame', 'Fluxos de autenticação tradicionais com redirecionamento de servidor falhariam com redirect_uri_mismatch na infraestrutura de pré-visualização. Implementou-se autenticação client-side com Firebase Auth Popup, com cache estrita de token em memória (sem persistência em localStorage) e diálogos de confirmação explícita para mutações.');
  addBullet('Tratamento de Pedidos Ambíguos em Linguagem Natural', 'Textos livres de clientes continham por vezes informação incompleta para cálculo de orçamento. A IA foi programada para classificar o estado em "necessita_revisao" quando faltam evidências de quantidade ou tempo, permitindo ao administrador definir os itens no painel antes da geração do documento final.');

  // --- SEÇÃO 4: FAQ ---
  addSectionTitle('Apêndice: Perguntas Frequentes (FAQ) da Plataforma', '4');

  const faqs = [
    {
      q: 'Como funciona a descoberta visual no Inspira?',
      a: 'O Inspira organiza milhões de ideias através de um modelo "Scroll-to-Wall" baseado no Efeito Zeigarnik e em grelhas dinâmicas tipo masonry. Focado 100% no conteúdo visual sem ruído de redes sociais tradicionais.',
    },
    {
      q: 'Como crio e organizo as minhas pastas de ideias?',
      a: 'Ao passar o cursor em qualquer ideia, clica-se em "Guardar" para criar pastas temáticas personalizadas e rever as ideias mais tarde.',
    },
    {
      q: 'Por que o Inspira utiliza "Continuar com o Google" em vez de cadastro longo?',
      a: 'Princípio de fricção zero de CRO. O botão "Continuar" reduz a barreira mental em mais de 40% com Single Sign-On seguro.',
    },
    {
      q: 'Os meus dados e pastas guardadas estão seguros?',
      a: 'Sim, as preferências são guardadas de forma segura com opção de pastas públicas ou privadas.',
    },
    {
      q: 'O que significa a fórmula dos 4 verbos: "Veja, faça, experimente, compre"?',
      a: 'Arquitetura psicológica de conversão progressiva: Descoberta passiva -> Instruções e receitas -> Validação prática -> Aquisição sem atrito.',
    },
    {
      q: 'Como agendar uma reunião sobre uma proposta emitida?',
      a: 'Através da integração com o Google Calendar, tanto na visualização da proposta como na aba "Calendário", é possível marcar uma sessão de apresentação por Google Meet com 1 clique.',
    },
  ];

  faqs.forEach((faq, i) => {
    doc
      .fillColor(darkSlate)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(`P${i + 1}: ${faq.q}`);
    doc
      .fillColor(textBody)
      .font('Helvetica')
      .fontSize(8.5)
      .lineGap(2)
      .text(`R: ${faq.a}`);
    doc.moveDown(0.3);
  });

  // Footer on both pages
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor(textMuted)
      .text(
        `Inspira Portugal · Documento Oficial do Projeto · Página ${i + 1} de ${range.count}`,
        50,
        790,
        { align: 'center', width: 495 }
      );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => {
      console.log('PDF gerado com sucesso em:', outputPath);
      resolve(outputPath);
    });
    writeStream.on('error', reject);
  });
}

generateProjectReportPDF()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Erro ao gerar PDF:', err);
    process.exit(1);
  });
