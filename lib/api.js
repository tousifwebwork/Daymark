import { NextResponse } from "next/server";

export const ok = (data, status = 200) => NextResponse.json({ data }, { status });
export const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function handleError(err) {
  console.error(err);
  if (err?.name === "ValidationError") return fail(err.message, 400);
  if (err?.name === "CastError") return fail("Invalid ID", 400);
  return fail("Something went wrong. Please try again.", 500);
}        




