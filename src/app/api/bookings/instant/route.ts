import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Compute price server-side later; placeholder 1000 MXN
  const amount = 1000_00; // cents
  const connectedAccountId = payload.connectedAccountId as string | undefined; // placeholder

  const stripe = getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "mxn",
    capture_method: "manual",
    application_fee_amount: Math.floor(amount * 0.15),
    transfer_data: connectedAccountId
      ? { destination: connectedAccountId }
      : undefined,
    metadata: { booking_seed: "true" },
  });

  return Response.json({ client_secret: paymentIntent.client_secret });
}

export const runtime = "nodejs";

