import type { APIRoute } from "astro";
import { validateSession, incrementQuizCount } from "../../lib/auth";
import { STATIC_QUESTIONS, QUIZ_TOPICS } from "../../lib/quiz-data";
import { QUIZ_GENERATION_PROMPT } from "../../lib/ai-prompts";

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

        const { topic, useAI } = await request.json();

        if (user.tier === "free") {
            return new Response(
                JSON.stringify({ error: "Quizzes are available for Premium users only. Upgrade to access the quiz system.", premiumRequired: true }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        await incrementQuizCount(user.email);

        if (useAI && topic) {
            try {
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
                        max_tokens: 1024,
                        system: QUIZ_GENERATION_PROMPT,
                        messages: [{ role: "user", content: `Generate a quiz question about: ${topic}` }],
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const aiText = data.content?.[0]?.text || "";
                    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        const question = JSON.parse(jsonMatch[0]);
                        question.topic = topic;
                        return new Response(JSON.stringify({ question }), {
                            status: 200,
                            headers: { "Content-Type": "application/json" },
                        });
                    }
                }
            } catch {
                // Fall through to static questions
            }
        }

        const filtered = topic
            ? STATIC_QUESTIONS.filter((q) => q.topic === topic)
            : STATIC_QUESTIONS;
        const question = filtered[Math.floor(Math.random() * filtered.length)];

        return new Response(JSON.stringify({ question }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("Quiz error:", err);
        return new Response(JSON.stringify({ error: "An error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
