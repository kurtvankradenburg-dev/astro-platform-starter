import type { APIRoute } from "astro";
import { validateSession } from "../../lib/auth";
import { PHYSIQUE_ANALYSIS_PROMPT } from "../../lib/ai-prompts";

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

        const { image, consent } = await request.json();
        if (!image) {
            return new Response(JSON.stringify({ error: "Image is required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!consent) {
            return new Response(JSON.stringify({ error: "Explicit consent is required for image analysis" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        const mediaType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

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
                max_tokens: 2048,
                system: PHYSIQUE_ANALYSIS_PROMPT,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: { type: "base64", media_type: mediaType, data: base64Data },
                            },
                            {
                                type: "text",
                                text: "Analyze this physique image. Provide scores and analysis for all categories. Respond ONLY with the JSON format specified in your instructions.",
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            console.error("Anthropic API error:", await response.text());
            return new Response(
                JSON.stringify({ error: "Analysis service temporarily unavailable" }),
                { status: 502, headers: { "Content-Type": "application/json" } }
            );
        }

        const data = await response.json();
        const aiText = data.content?.[0]?.text || "";

        let analysis;
        try {
            const jsonMatch = aiText.match(/\{[\s\S]*\}/);
            analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch {
            analysis = null;
        }

        if (!analysis) {
            return new Response(
                JSON.stringify({ error: "Could not parse analysis results. Please try again with a clearer photo." }),
                { status: 422, headers: { "Content-Type": "application/json" } }
            );
        }

        const isFree = user.tier === "free";
        if (isFree) {
            const partialScores: any = {};
            const keys = Object.keys(analysis.scores);
            keys.slice(0, 3).forEach((key: string) => {
                partialScores[key] = analysis.scores[key];
            });
            keys.slice(3).forEach((key: string) => {
                partialScores[key] = { score: analysis.scores[key].score, analysis: "Upgrade to Premium for detailed analysis" };
            });
            analysis.scores = partialScores;
            analysis.recommendations = [analysis.recommendations?.[0] || "Upgrade to Premium for full recommendations"];
        }

        return new Response(JSON.stringify({ analysis, tier: user.tier }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("Analyze error:", err);
        return new Response(JSON.stringify({ error: "An error occurred during analysis" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
