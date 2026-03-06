import type { APIRoute } from "astro";
import { validateSession } from "../../lib/auth";

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

        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        console.error("Subscription error:", err);
        return new Response(JSON.stringify({ error: err.message || "Subscription error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
