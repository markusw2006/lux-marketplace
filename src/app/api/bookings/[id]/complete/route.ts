import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  // Placeholder: capture PI for this booking when ready
  // const stripe = getStripe();
  return Response.json({ id, status: "completed" });
}


