import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ disputes: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return Response.json({ action: body }, { status: 201 });
}


