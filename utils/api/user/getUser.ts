"use server";
import { cookies } from "next/headers";
import makeRequest from "../../makeRequest";
import { userTag } from "../../tags";

export type IUser = {
  _id: string;
  token: string;
  userType: "individual" | "non-profit";
  organizationId: string | null;
  fullName: string;
  gender: string;
  email: string;
  interests: string[];
  isEmailVerified: boolean;
  organizationName: string;
  phoneNumber?: string;
  isAdmin?: boolean;
};

// for getting user in server components, also a server action that can be called from client components
export const getUser = async () => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) {
    return null;
  }

  const endpoint = `/users/current-user`;
  const headers = {
    "x-auth-token": token
  };

  const { data: user } = await makeRequest<IUser>(endpoint, {
    headers,
    cache: "force-cache",
    tags: [userTag] // for cache revalidation
  });
  return user;
};

export const getToken = async () => {
  const cookie = await cookies();
  const token = cookie.get("token")?.value;
  return token
};
