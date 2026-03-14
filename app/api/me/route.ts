import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ isAdmin: false, user: null });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const isAdmin = !!adminEmail && user.email === adminEmail;

    return NextResponse.json({
      isAdmin,
      user: { email: user.email },
    });
  } catch {
    return NextResponse.json({ isAdmin: false, user: null });
  }
}
