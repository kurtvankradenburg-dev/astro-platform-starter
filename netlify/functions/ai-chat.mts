import type { Context, Config } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export default async (req: Request, context: Context) => {
    try {
        const { message, history } = await req.json();

        if (!message) {
            return Response.json({ error: 'Message is required' }, { status: 400 });
        }

        const messages: { role: 'user' | 'assistant'; content: string }[] = [];

        if (history && Array.isArray(history)) {
            for (const msg of history.slice(-6)) {
                messages.push({ role: msg.role, content: msg.content });
            }
        }

        messages.push({ role: 'user', content: message });

        const result = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 2048,
            system: 'You are a helpful AI assistant built into the Eco City platform. You can help with any topic — homework, writing, research, coding, general knowledge, creative tasks, and more. Be helpful, clear, and concise. CRITICAL FORMATTING RULES YOU MUST FOLLOW: Write your response as clean, well-structured paragraphs only. Separate distinct ideas into their own paragraphs using double line breaks. Never use bullet points, numbered lists, asterisks, stars, hash symbols, or any markdown formatting such as bold, italic, headers, or code blocks. Do not begin any line with a hash character or special symbol. Use proper punctuation and natural sentence flow throughout. Your tone should be clear, intelligent, and structured. Write in a readable, conversational style with proper paragraph breaks between topics.',
            messages,
        });

        const response = result.content[0].type === 'text' ? result.content[0].text : 'Sorry, I could not process that.';

        return Response.json({ response });
    } catch (error: any) {
        console.error('AI Chat error:', error);
        return Response.json({ response: 'Sorry, something went wrong. Please try again.' }, { status: 200 });
    }
};

export const config: Config = {
    path: '/api/ai-chat',
    method: 'POST',
};
