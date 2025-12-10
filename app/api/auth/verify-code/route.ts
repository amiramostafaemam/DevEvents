import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_CODE = process.env.ADMIN_ACCESS_CODE || "ADMIN2024";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (code === ADMIN_CODE) {
      const cookieStore = await cookies();
      cookieStore.set("admin_authenticated", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid code" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
