import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!process.env.APP_PASSWORD) {
    return NextResponse.json(
      { error: "APP_PASSWORD not configured" },
      { status: 500 }
    );
  }

  if (password === process.env.APP_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("app_auth", btoa(process.env.APP_PASSWORD), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("app_auth");
  return response;
}
