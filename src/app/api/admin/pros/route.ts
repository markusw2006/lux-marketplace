import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ pros: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return Response.json({ updated: body }, { status: 201 });
}


