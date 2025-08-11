import { NextRequest } from "next/server";
import { listServices } from "@/server/servicesRepo";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const categorySlug = searchParams.get("category_id");
  const filtered = await listServices(categorySlug || undefined);
  return Response.json({ services: filtered });
}


