import makeRequest from "../../makeRequest";
import { getUser } from "../user/getUser";
import { IGetProfileResponseData } from "@/api/_profile/models/GetProfile";

// Need to add the Record type definition
type Record<K extends string | number | symbol = string, V = any> = {
  [P in K]: V;
};

export const getSingleProfile = async (userId: string, noAuth?: boolean) => {
  let headers: Record = {};

  try {
    const user = await getUser();

    if (user && !noAuth) {
      headers["x-auth-token"] = user.token;
    }

    const endpoint = `/profile/${userId}`;

    const { data: profile } = await makeRequest<{ data: IGetProfileResponseData }>(endpoint, {
      headers,
      next: {
        revalidate: 300, // Revalidate every 5 minutes for SEO
      },
    });

    return profile;
  } catch (error) {
    console.error(`Error fetching profile with ID ${userId}:`, error);
    // Return null to indicate the profile couldn't be fetched
    return null;
  }
};