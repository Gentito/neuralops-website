import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: unknown; email?: unknown; message?: unknown }
    | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please provide name, email, and a message." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Message is too short. Please add a bit more detail." },
      { status: 400 }
    );
  }

  const emailIntegrationEnabled =
    Boolean(process.env.CONTACT_PROVIDER) &&
    Boolean(process.env.CONTACT_API_KEY) &&
    Boolean(process.env.CONTACT_TO_EMAIL);

  return NextResponse.json({
    ok: true,
    queued: emailIntegrationEnabled
  });
}

