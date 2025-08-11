import { NextRequest } from "next/server";
import { getSupabaseService } from "@/lib/db";

export async function GET(_req: NextRequest) {
  const sb = getSupabaseService();
  if (!sb) return Response.json({ bookings: [] });
  const { data } = await sb.from("bookings").select("*").limit(20);
  return Response.json({ bookings: data || [] });
}


