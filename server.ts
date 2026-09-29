import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

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

// API endpoint for Inspiria CRO & Discovery Chatbot
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensagens inválidas fornecidas.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Graceful intelligent fallback if key is not yet set
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: `[Inspiria Assistente]: Compreendi a sua pergunta sobre "${lastUserMsg.slice(0, 30)}...". No Inspiria, utilizamos a mecânica de descobertas visuais imediatas, inserção dinâmica de desejos e a fórmula "Veja, faça, experimente, compre" para transformar ideias em ações na vida real. Em que nicho ou projeto você gostaria de se aprofundar?`,
      });
    }

    const systemInstruction = `Você é o "Inspiria Copilot", o assistente inteligente oficial da plataforma Inspiria (pt.inspiria.com).
O Inspiria é uma plataforma visual dinâmica de estilo de vida, descoberta e inspiração prática (focada em culinária, decoração de interiores, moda/estilo e bricolage/DIY).
Sua missão:
1. Auxiliar os utilizadores a encontrarem ideias práticas (ex: receitas de jantar, dicas de decoração escandinava ou nórdica, looks de outono/inverno, projetos de cerâmica ou marcenaria).
2. Responder perguntas sobre a metodologia de conversão (CRO), psicologia de descoberta visual e copywriting comportamental do Inspiria (como o Efeito Zeigarnik com pins cortados na dobra, perda evitada com pastas salvas, o clímax tetrádico "Veja, faça, experimente, compre", e a fórmula "Encontre a sua próxima [ideia]").
3. Manter um tom caloroso, inspirador, elegante, prestativo e sucinto em Português de Portugal ou neutro.
4. Jamais mencionar "Pinterest". O nome da plataforma é Inspiria (pt.inspiria.com).`;

    // Format chat history for Gemini API
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Desculpe, não consegui gerar uma resposta no momento.';
    return res.json({ reply });
  } catch (error: any) {
    console.error('Erro na API de chat:', error);
    return res.status(500).json({
      error: 'Ocorreu um erro ao comunicar com a inteligência artificial do Inspiria.',
      details: error?.message,
    });
  }
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
    console.log(`Servidor Inspiria a correr em http://localhost:${port}`);
  });
}

startServer();
