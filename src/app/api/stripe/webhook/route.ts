import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const rawBody = await req.text();
  let event: unknown;
  try {
    const stripe = getStripe();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event = (stripe as any).webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  // TODO: handle events (payment_intent.succeeded, transfer.created, etc.)
  return new Response("ok");
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

