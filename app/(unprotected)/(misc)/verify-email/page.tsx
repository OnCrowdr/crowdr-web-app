import { userTag } from "@/utils/tags";
import makeRequest from "@/utils/makeRequest";
import { redirect } from "next/navigation";
import { revalidate } from "@/utils/api/revalidate";
import { extractErrorMessage } from "@/utils/extractErrorMessage";


export default async function VerifyEmail(
  props: {
    searchParams: Promise<{ [key: string]: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const { token } = searchParams;

  if (token) {
    const endpoint = `/users/verify-email`;
    const headers = { "X-Auth-Token": token };


    try {
      await makeRequest(endpoint, { headers, cache: "no-cache" });
    
      revalidate(userTag); // revalidate after user isEmailVerified property changes
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-screen w-screen">
          <div>{extractErrorMessage(error)}</div>
        </div>
      );
    }

    // redirect if there is no error
    redirect("/login");
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div>No token supplied</div>
      </div>
    );
  }
}
