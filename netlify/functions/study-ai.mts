import type { Context, Config } from '@netlify/functions';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export default async (req: Request, context: Context) => {
    try {
        const { action, text, question } = await req.json();

        if (!text) {
            return Response.json({ error: 'Text is required' }, { status: 400 });
        }

        let prompt = '';
        let systemPrompt = 'You are a study assistant built into the Eco City platform. Help students learn effectively. Be clear, educational, and encouraging. IMPORTANT FORMATTING RULES: Always respond in clean, well-structured paragraphs. Never use bullet points, asterisks, stars, or hashtags. Do not use markdown formatting like bold or headers. Use proper punctuation and natural sentence flow. The only exception is when generating flashcards as JSON.';

        switch (action) {
            case 'summarize':
                prompt = `Please provide a clear, structured summary of the following study material in well-written paragraphs. Do not use bullet points or special formatting:\n\n${text}`;
                break;
            case 'explain':
                prompt = `Please explain the following concept in simple, clear paragraphs. Use examples where helpful but do not use bullet points or special formatting:\n\n${text}`;
                break;
            case 'ask':
                prompt = `Based on the following study material:\n\n${text}\n\nPlease answer this question:\n${question}`;
                break;
            case 'flashcards':
                prompt = `Generate 6-8 flashcards from the following study material. Return them as a JSON array with "front" (question) and "back" (answer) fields. Only return the JSON array, nothing else:\n\n${text}`;
                break;
            default:
                return Response.json({ error: 'Invalid action' }, { status: 400 });
        }

        const result = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 2048,
            system: systemPrompt,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = result.content[0].type === 'text' ? result.content[0].text : '';

        if (action === 'flashcards') {
            try {
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                    const cards = JSON.parse(jsonMatch[0]);
                    return Response.json({ cards });
                }
            } catch {}
            return Response.json({ cards: [{ front: 'Could not generate flashcards', back: 'Please try again with different content' }] });
        }

        return Response.json({ result: content });
    } catch (error: any) {
        console.error('Study AI error:', error);
        return Response.json({ result: 'Sorry, something went wrong. Please try again.' }, { status: 200 });
    }
};

export const config: Config = {
    path: '/api/study-ai',
    method: 'POST',
};
