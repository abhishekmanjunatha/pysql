import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, apiKey, query, error, schema, context, messages } = req.body;

    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API Key' });
    }

    const systemPrompt = `
You are an expert SQL Assistant for a Data Engineering platform.
Your goal is to help the user write correct SQL queries.

Context:
- Challenge: "${context?.title || 'Playground'}"
- Task: "${context?.task || 'Explore data'}"
- Schema: ${JSON.stringify(schema)}

Current State:
- User's Query: ${query}
- Error: ${error || 'None'}

Instructions:
1. Be concise and direct.
2. If the user asks for a fix, PROVIDE THE SQL CODE.
3. Wrap SQL code in markdown blocks like: \`\`\`sql ... \`\`\`
4. Explain the logic briefly.
`;

    let responseText = '';
    
    // Construct conversation history
    const conversation = [
      { role: 'system', content: systemPrompt },
      ...(messages || []).map((m: any) => ({ role: m.role, content: m.content })),
    ];
    
    // If no messages provided (first run), add default user prompt
    if (!messages || messages.length === 0) {
      conversation.push({ role: 'user', content: 'Analyze my query and help me fix it.' });
    }

    if (provider === 'groq') {
      const openai = new OpenAI({ 
        apiKey, 
        baseURL: 'https://api.groq.com/openai/v1' 
      });
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: conversation as any,
      });
      responseText = completion.choices[0].message.content || 'No response';
    } else {
      return res.status(400).json({ error: 'Only Groq is supported currently.' });
    }

    return res.status(200).json({ text: responseText });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
