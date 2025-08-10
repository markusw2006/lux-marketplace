import { NextRequest } from "next/server";

// Placeholder: In MVP we will fetch from Supabase RPC or tables.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("category_id");
  const alcaldia = searchParams.get("alcaldia");

  return Response.json({ services: [], categoryId, alcaldia });
}


