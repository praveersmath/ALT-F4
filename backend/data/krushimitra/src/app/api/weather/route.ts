import { NextRequest, NextResponse } from "next/server";
import { getDistrictWeather, getAllDistrictsWeather } from "@/lib/weather";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const district = req.nextUrl.searchParams.get("district");
  if (district === "all") {
    const all = await getAllDistrictsWeather();
    return NextResponse.json({ ok: true, districts: all });
  }
  const w = await getDistrictWeather(district ?? "KOL");
  return NextResponse.json({ ok: true, district: w });
}
