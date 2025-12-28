import type { VercelRequest, VercelResponse } from '@vercel/node';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { provider, apiKey, query, error, schema, context } = req.body;

    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API Key' });
    }

    const systemPrompt = `
You are a friendly and helpful SQL tutor for a Data Engineering practice platform.
Your goal is to help the user fix their SQL query or understand a concept WITHOUT giving them the direct answer code.
Use the Socratic method: ask guiding questions, explain the error in simple terms, or provide a similar example.

Context:
- The user is working on a challenge: "${context?.title || 'Unknown'}"
- Task: "${context?.task || 'Unknown'}"
- Schema: ${JSON.stringify(schema)}

User's Query:
${query}

Error Message:
${error}

Instructions:
1. Analyze the error and the query.
2. Explain *why* the error happened.
3. Give a hint on how to fix it.
4. DO NOT write the corrected SQL query for them.
5. Keep it short (max 3 sentences).
`;

    let responseText = '';

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Please help me.' }],
      });
      responseText = completion.choices[0].message.content || 'No response';
    } else if (provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(apiKey);
      // Try multiple models in order of preference to handle region/account availability
      const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
      
      let lastError;
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(systemPrompt);
          responseText = result.response.text();
          break; // Success, exit loop
        } catch (err) {
          console.warn(`Failed to use model ${modelName}:`, err);
          lastError = err;
          // Continue to next model
        }
      }
      
      if (!responseText && lastError) {
        throw lastError;
      }
    } else if (provider === 'groq') {
      const openai = new OpenAI({ 
        apiKey, 
        baseURL: 'https://api.groq.com/openai/v1' 
      });
      const completion = await openai.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Please help me.' }],
      });
      responseText = completion.choices[0].message.content || 'No response';
    } else if (provider === 'xai') {
      const openai = new OpenAI({ 
        apiKey, 
        baseURL: 'https://api.x.ai/v1' 
      });
      const completion = await openai.chat.completions.create({
        model: 'grok-beta',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: 'Please help me.' }],
      });
      responseText = completion.choices[0].message.content || 'No response';
    } else {
      return res.status(400).json({ error: 'Invalid Provider' });
    }

    return res.status(200).json({ text: responseText });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
