import { getStore } from "@netlify/blobs";

interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    salt: string;
    tier: "free" | "premium";
    premiumExpiresAt: string | null;
    messagesUsed: number;
    messagesResetAt: string;
    quizzesUsedToday: number;
    quizzesResetAt: string;
    createdAt: string;
}

const PAYPAL_VERIFY_URL = "https://ipnpb.paypal.com/cgi-bin/webscr";
const USERS_STORE = "myogen-users";

export default async function handler(req: Request) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await req.text();
        const params = new URLSearchParams(body);

        // Verify the IPN message with PayPal
        const verifyBody = `cmd=_notify-validate&${body}`;
        const verifyRes = await fetch(PAYPAL_VERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: verifyBody,
        });
        const verifyText = await verifyRes.text();

        if (verifyText !== "VERIFIED") {
            console.error("PayPal IPN verification failed:", verifyText);
            return new Response("IPN verification failed", { status: 400 });
        }

        const paymentStatus = params.get("payment_status");
        const payerEmail = params.get("payer_email")?.toLowerCase();
        const customEmail = params.get("custom")?.toLowerCase();
        const txnType = params.get("txn_type");

        // Only process completed payments and subscription signups
        if (paymentStatus !== "Completed" && txnType !== "subscr_payment") {
            console.log("Ignoring non-completed payment:", paymentStatus, txnType);
            return new Response("OK", { status: 200 });
        }

        // Try to find user by custom field first (their Myogen email), then by payer email
        const targetEmail = customEmail || payerEmail;
        if (!targetEmail) {
            console.error("No email found in IPN");
            return new Response("No email", { status: 400 });
        }

        const store = getStore(USERS_STORE);
        let user = await store.get(targetEmail, { type: "json" }) as User | null;

        // If custom email didn't match, try payer email
        if (!user && customEmail && payerEmail && customEmail !== payerEmail) {
            user = await store.get(payerEmail, { type: "json" }) as User | null;
        }

        if (!user) {
            console.error("User not found for email:", targetEmail);
            return new Response("User not found", { status: 404 });
        }

        // Activate premium for 30 days
        user.tier = "premium";
        user.premiumExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await store.setJSON(user.email, user);

        console.log("Premium activated for:", user.email);
        return new Response("OK", { status: 200 });
    } catch (err: any) {
        console.error("PayPal webhook error:", err);
        return new Response("Server error", { status: 500 });
    }
}
