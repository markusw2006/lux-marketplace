import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { optional, required } from "@/lib/env";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const { account } = await req.json();
  const accountId: string | undefined = account;

  const link = await stripe.accountLinks.create({
    account: accountId!,
    refresh_url: `${optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}/pro/onboarding?refresh=1`,
    return_url: `${optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000")}/pro/onboarding?return=1`,
    type: "account_onboarding",
  });

  return Response.json({ url: link.url });
}

export const runtime = "nodejs";

