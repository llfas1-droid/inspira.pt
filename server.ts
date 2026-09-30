import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, FunctionDeclaration, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// In-memory bookings store with sample unavailable slot to demonstrate collision handling
export interface Booking {
  id: string;
  data_hora: string; // ISO 8601 string
  nome: string;
  email: string;
  criado_em: string;
}

// Initial busy slot for testing collisions: e.g. tomorrow at 14:00 Lisbon time
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(now.getDate() + 1);
const busyDateString = `${tomorrow.toISOString().split('T')[0]}T14:00:00+01:00`;

const bookedSlots: Booking[] = [
  {
    id: 'res-pre-1',
    data_hora: busyDateString,
    nome: 'Reunião Externa Bloqueada',
    email: 'contacto@cliente.com',
    criado_em: new Date().toISOString(),
  },
];

// Tool function implementation
export function marcarReuniaoTool(data_hora: string, nome: string, email: string): {
  success: boolean;
  message: string;
  reuniao?: Booking;
  erro?: string;
  cal_link?: string;
} {
  // Normalize and parse ISO timestamp
  const requestedDate = new Date(data_hora);
  if (isNaN(requestedDate.getTime())) {
    return {
      success: false,
      erro: 'FORMATO_INVALIDO',
      message: 'A data e hora fornecidas não puderam ser convertidas para um formato válido.',
    };
  }

  // Check collision: if there is already a meeting within 45 minutes of requested time
  const reqTime = requestedDate.getTime();
  const collision = bookedSlots.find((b) => {
    const slotTime = new Date(b.data_hora).getTime();
    return Math.abs(slotTime - reqTime) < 45 * 60 * 1000;
  });

  if (collision) {
    return {
      success: false,
      erro: 'HORARIO_INDISPONIVEL',
      message: `O horário ${data_hora} já se encontra ocupado na agenda da Luisa Lins.`,
      cal_link: 'https://cal.com/luisa-lins-qrhlyj/agendamentos',
    };
  }

  // Success: Register booking
  const novaReuniao: Booking = {
    id: `book-${Date.now()}`,
    data_hora,
    nome,
    email,
    criado_em: new Date().toISOString(),
  };
  bookedSlots.push(novaReuniao);

  return {
    success: true,
    message: `Reunião agendada com sucesso com Luisa Lins para ${data_hora}.`,
    reuniao: novaReuniao,
  };
}

// Initialize server-side Gemini client as instructed in the gemini-api skill
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Tool declaration for Function Calling in Gemini
const marcarReuniaoDeclaration: FunctionDeclaration = {
  name: 'marcar_reuniao',
  description:
    'Efetua a marcação formal de uma reunião na agenda da Luisa Lins após recolher Data/Hora, Nome Completo e Email.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      data_hora: {
        type: Type.STRING,
        description:
          'Data e hora exata da reunião em formato ISO 8601 considerando o fuso horário de Lisboa/Portugal (Europe/Lisbon, ex: "2026-10-01T15:00:00+01:00").',
      },
      nome: {
        type: Type.STRING,
        description: 'Nome completo do cliente.',
      },
      email: {
        type: Type.STRING,
        description: 'Endereço de e-mail do cliente.',
      },
    },
    required: ['data_hora', 'nome', 'email'],
  },
};

const SYSTEM_INSTRUCTION = `Atuas exclusivamente como a Assistente Virtual de Agendamentos da Luisa Lins. O teu objetivo é ajudar os clientes a marcarem reuniões de forma rápida e eficiente.

Tens acesso a uma ferramenta chamada \`marcar_reuniao\`. O teu trabalho é recolher as informações do cliente e usar essa ferramenta para efetuar a marcação. 

Se o cliente preferir marcar por conta própria, podes fornecer o link oficial: https://cal.com/luisa-lins-qrhlyj/agendamentos

# FLUXO DE ATENDIMENTO:
1. Pergunta qual é o dia e a hora exata em que o cliente deseja reunir (ex: amanhã às 14h).
2. Pede o Nome completo e o Email do cliente (se ele ainda não os tiver fornecido).
3. Assim que tiveres os 3 dados (Data/Hora, Nome, Email), executa IMEDIATAMENTE a ferramenta \`marcar_reuniao\`. (Converte a data e hora para o formato ISO 8601, assumindo o fuso horário de Lisboa/Portugal).

# LIDAR COM RESULTADOS DA FERRAMENTA:
- Se a ferramenta retornar SUCESSO: Confirma ao cliente que a reunião está marcada e que ele receberá os detalhes no email.
- Se a ferramenta retornar ERRO (ex: horário indisponível): Pede desculpa, explica que esse horário já está ocupado e pergunta qual seria a segunda opção de horário do cliente. Em alternativa, oferece o link https://cal.com/luisa-lins-qrhlyj/agendamentos para ele ver a disponibilidade e marcar diretamente.

# REGRAS ESTRITAS:
- Não tentes adivinhar dados. Se o cliente disser "quinta-feira à tarde", pergunta: "Prefere às 14h, 15h ou 16h?".
- Não faças várias perguntas na mesma mensagem. Mantém a conversa natural.
- Sê cordial, direta e foca-te apenas no agendamento.
- Data atual de referência: 30 de setembro de 2026.`;

// API endpoint for Luisa Lins Assistant Chatbot
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensagens inválidas fornecidas.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback deterministic conversational engine adhering strictly to Luisa Lins rules
      const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
      const allText = messages.map((m: any) => m.content).join(' ');

      // Check if user provided email
      const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const email = emailMatch ? emailMatch[0] : null;

      // Extract time keywords
      const hasTime = /(1[0-9]|2[0-3]|0?[8-9]):?[0-9]{0,2}|[0-9]{1,2}h|amanhã|segunda|terça|quarta|quinta|sexta/i.test(
        allText
      );

      // Check if full name provided
      const nameMatch = allText.match(/(?:chamo-me|o meu nome é|sou o|sou a|nome:?)\s*([A-ZÁÉÍÓÚa-záéíóú]+(?:\s+[A-ZÁÉÍÓÚa-záéíóú]+)+)/i);
      const nome = nameMatch ? nameMatch[1] : null;

      if (hasTime && nome && email) {
        // Trigger tool execution
        const isoTime = `${tomorrow.toISOString().split('T')[0]}T15:00:00+01:00`;
        const result = marcarReuniaoTool(isoTime, nome, email);
        if (result.success) {
          return res.json({
            reply: `Perfeito, ${nome}! A sua reunião com a Luisa Lins está confirmada para ${isoTime}. Enviámos todos os detalhes de confirmação para o email ${email}.`,
            toolCallExecuted: {
              name: 'marcar_reuniao',
              args: { data_hora: isoTime, nome, email },
              result,
            },
          });
        } else {
          return res.json({
            reply: `Peço desculpa, mas esse horário já se encontra ocupado na agenda da Luisa Lins. Qual seria a sua segunda opção de horário? Se preferir ver todos os horários livres e marcar diretamente, pode usar este link: https://cal.com/luisa-lins-qrhlyj/agendamentos`,
            toolCallExecuted: {
              name: 'marcar_reuniao',
              args: { data_hora: isoTime, nome, email },
              result,
            },
          });
        }
      }

      if (!hasTime) {
        return res.json({
          reply: 'Olá! Sou a Assistente Virtual de Agendamentos da Luisa Lins. Para qual dia e hora gostaria de marcar a sua reunião?',
        });
      }

      if (!nome) {
        return res.json({
          reply: 'Com certeza! Qual é o seu nome completo?',
        });
      }

      if (!email) {
        return res.json({
          reply: `Obrigada, ${nome}! E qual é o seu melhor endereço de email para enviarmos a confirmação da reunião?`,
        });
      }

      return res.json({
        reply: 'Pode indicar-me o dia e a hora exata em que prefere reunir?',
      });
    }

    // Server-side Gemini with Function Calling
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Step 1: Initial call to Gemini with the tool
    const initialResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        tools: [{ functionDeclarations: [marcarReuniaoDeclaration] }],
      },
    });

    const functionCalls = initialResponse.functionCalls;

    // If Gemini chose to call `marcar_reuniao`
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'marcar_reuniao') {
        const { data_hora, nome, email } = (call.args as any) || {};
        const toolResult = marcarReuniaoTool(data_hora, nome, email);

        // Step 2: Feed function call result back to Gemini so it generates the final conversational response
        const candidateContent = initialResponse.candidates?.[0]?.content;
        const toolFollowupContents: any[] = [...formattedContents];
        if (candidateContent) {
          toolFollowupContents.push(candidateContent);
        }
        toolFollowupContents.push({
          role: 'user',
          parts: [
            {
              functionResponse: {
                name: 'marcar_reuniao',
                response: toolResult,
              },
            },
          ],
        });

        const finalResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: toolFollowupContents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.2,
          },
        });

        return res.json({
          reply:
            finalResponse.text ||
            (toolResult.success
              ? `Reunião marcada com sucesso para ${data_hora}! Os detalhes foram enviados para ${email}.`
              : `Peço desculpa, esse horário já está ocupado. Qual seria a sua segunda opção? Ou marque por este link: https://cal.com/luisa-lins-qrhlyj/agendamentos`),
          toolCallExecuted: {
            name: 'marcar_reuniao',
            args: { data_hora, nome, email },
            result: toolResult,
          },
        });
      }
    }

    const reply = initialResponse.text || 'Olá! Como posso ajudar a agendar a sua reunião com a Luisa Lins?';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Erro na API de agendamento:', error);
    return res.status(500).json({
      error: 'Ocorreu um erro no processamento do agendamento.',
      details: error?.message,
    });
  }
});

// Endpoint to view confirmed bookings
app.get('/api/agendamentos', (req: Request, res: Response) => {
  res.json({ bookings: bookedSlots });
});

// Endpoint to directly test tool execution
app.post('/api/marcar_reuniao', (req: Request, res: Response) => {
  const { data_hora, nome, email } = req.body;
  const result = marcarReuniaoTool(data_hora, nome, email);
  res.json(result);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Assistente de Agendamentos da Luisa Lins ativo em http://localhost:${port}`);
  });
}

startServer();
