export const runtime = "edge";

import { aj } from "lib/arcjet"; // ✅ use relative path
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cost = req.url.includes("/login") ? 10 : 2;
  const decision = await aj.protect(req, { requested: cost });

  console.log("Arcjet decision:", decision.reason.toString());
  console.log("Request IP:", req.headers.get("x-forwarded-for") || "unknown");
  console.log("Path:", new URL(req.url).pathname, "Cost:", cost);

  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Blocked", reason: decision.reason.toString() },
      { status: 429 }
    );
  }

  return NextResponse.json({ message: "Arcjet is working." });
}

