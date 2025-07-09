"use server"
import { userTag } from "../../../tags";
import makeRequest from "../../../utils/makeRequest";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { extractErrorMessage } from "../../../utils/extractErrorMessage";
import { after } from "next/server";

// Server Action to handle verification
async function verifyEmailAction(token: string) {
  "use server";
  
  const endpoint = `/users/verify-email`;
  const headers = { "X-Auth-Token": token };

  try {
    await makeRequest(endpoint, { headers, cache: "no-cache" });
    after(() => {
      revalidateTag(userTag); // This is now safe to call in a Server Action
    })
    return { success: true };
  } catch (error) {
    return { success: false, error: extractErrorMessage(error) };
  }
}

export default async function VerifyEmail(
  props: {
    searchParams: Promise<{ [key: string]: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { token } = searchParams;

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div>No token supplied</div>
      </div>
    );
  }

  // Call the server action
  const result = await verifyEmailAction(token);

  if (!result.success) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div>{result.error}</div>
      </div>
    );
  }

  // Redirect if verification was successful
  redirect("/login");
}