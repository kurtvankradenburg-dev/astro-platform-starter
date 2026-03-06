import type { APIRoute } from "astro";
import { validateSession, deleteSession } from "../../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return new Response(JSON.stringify({ error: "No token provided" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const user = await validateSession(token);
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid or expired session" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: "Session validation failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

export const DELETE: APIRoute = async ({ request }) => {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (token) {
            await deleteSession(token);
        }
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
};
