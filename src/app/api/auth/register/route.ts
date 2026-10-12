

import { NextResponse } from "next/server";


export async function POST() {
  return NextResponse.json(
    { error: "Direct registration is disabled. Please register with email verification." },
    { status: 410 }
  );
}