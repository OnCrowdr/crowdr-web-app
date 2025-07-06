"use server";
import { COOKIE_CONFIG } from "../../../config";
import { cookies } from "next/headers";

export default async function setUserCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, COOKIE_CONFIG);
  return;
}

