import type { APIRoute } from "astro";
import { validateSession, incrementMessageCount } from "../../lib/auth";
import { CHAT_SYSTEM_PROMPT } from "../../lib/ai-prompts";

export const POST: APIRoute = async ({ request }) => {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await validateSession(token);
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid session" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { message, mode } = await request.json();
        if (!message) {
            return new Response(JSON.stringify({ error: "Message is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const limit = await incrementMessageCount(user.email);
        if (!limit.allowed) {
            return new Response(
                JSON.stringify({
                    error: "Monthly message limit reached. Upgrade to Premium for unlimited messages.",
                    limitReached: true,
                    used: limit.used,
                    limit: limit.limit,
                }),
                { status: 429, headers: { "Content-Type": "application/json" } }
            );
        }

        const maxTokens = mode === "short" ? 300 : user.tier === "premium" ? 2048 : 800;

        const systemPrompt =
            mode === "short"
                ? CHAT_SYSTEM_PROMPT + "\n\nIMPORTANT: Provide a concise answer (2-4 sentences max). Still include the key biomechanical or physiological mechanism."
                : CHAT_SYSTEM_PROMPT;

        const apiBase = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
        const apiUrl = apiBase.endsWith("/v1") ? `${apiBase}/messages` : `${apiBase}/v1/messages`;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY || "",
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-sonnet-4-20250514",
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: [{ role: "user", content: message }],
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Anthropic API error:", errText);
            return new Response(
                JSON.stringify({ error: "AI service temporarily unavailable. Please try again." }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        const data = await response.json();
        const aiResponse = data.content?.[0]?.text || "I apologize, but I could not generate a response. Please try again.";

        return new Response(
            JSON.stringify({
                response: aiResponse,
                messagesUsed: limit.used,
                messagesLimit: limit.limit,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        console.error("Chat error:", err);
        return new Response(JSON.stringify({ error: "An error occurred processing your request" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
