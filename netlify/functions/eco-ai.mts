import type { Context, Config } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export default async (req: Request, context: Context) => {
    try {
        const { question, town, context: articleContext } = await req.json();

        if (!question) {
            return Response.json({ error: 'Question is required' }, { status: 400 });
        }

        const systemPrompt = `You are Eco AI, the town intelligence assistant for ${town || 'South Africa'}. You are part of the Eco City civic platform.

Your role:
- Answer questions about town history, infrastructure, sustainability, local services, and community issues
- Be educational, structured, and factual
- When given article context, use it to inform your answers
- Always relate answers to the user's town when possible
- Be concise but thorough
- Never make up specific statistics or facts — if unsure, say so
- Tone: professional, helpful, educational

Context from Knowledge Centre articles:
${articleContext || 'No articles provided.'}`;

        const message = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: 'user', content: question }],
        });

        const answer = message.content[0].type === 'text' ? message.content[0].text : 'I could not generate a response.';

        return Response.json({ answer });
    } catch (error: any) {
        console.error('Eco AI error:', error);
        return Response.json({ answer: 'Sorry, I encountered an error processing your question. Please try again.' }, { status: 200 });
    }
};

export const config: Config = {
    path: '/api/eco-ai',
    method: 'POST',
};
