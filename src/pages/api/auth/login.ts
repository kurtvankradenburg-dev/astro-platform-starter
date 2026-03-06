import type { APIRoute } from "astro";
import { loginUser } from "../../../lib/auth";

export const POST: APIRoute = async ({ request }) => {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { user, token } = await loginUser(email, password);
        return new Response(JSON.stringify({ user, token }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message || "Login failed" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
};
