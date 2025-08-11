import { NextRequest } from "next/server";
import { getServiceByIdRepo } from "@/server/servicesRepo";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const service = await getServiceByIdRepo(id);
  if (!service) return new Response("Not found", { status: 404 });
  return Response.json({ id, service });
}


