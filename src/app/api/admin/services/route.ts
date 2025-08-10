import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ services: [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return Response.json({ created: body }, { status: 201 });
}


