import type { APIRoute } from "astro";
import { createUser } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email, password, name } = await request.json();
        if (!email || !password || !name) {
            return new Response(JSON.stringify({ error: "Email, password, and name are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { user, token } = await createUser(email, password, name);
        return new Response(JSON.stringify({ user, token }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Signup failed" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
};
