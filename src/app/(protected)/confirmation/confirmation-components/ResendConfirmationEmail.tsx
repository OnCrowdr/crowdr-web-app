"use client";
import { revalidate } from "@/app/api/revalidate";
import { getUser } from "@/app/api/user/getUser";
import OldButton from "@/app/common/components/OldButton";
import { useToast } from "@/app/common/hooks/useToast";
import { userTag } from "@/tags";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import makeRequest from "@/utils/makeRequest";
import { useState } from "react";

export default function ResendConfirmationEmail() {
  const toast = useToast();
  const [isSubmitting, setSubmitting] = useState(false);
  const resendEmail = async () => {
    try {
      setSubmitting(true);
      const user = (await getUser())!;
      const endpoint = `/api/v1/users/resend-verification-link`;

      const headers = {
        // certain that token should be defined here, cause their is middleware protecting this route
        "x-auth-token": user.token!,
      };

      const data = await makeRequest<{ message: string }>(endpoint, {
        headers,
        method: "GET",
        cache: "no-store",
      });
      revalidate(userTag);
      toast({ title: "Success!", body: data.message, type: "success" });
    } catch (error: any) {
      const message = extractErrorMessage(error);
      toast({ title: "Oops!", body: message, type: "error" });
    }
    setSubmitting(false);
  };
  return (
    <>
      <OldButton
        type="button"
        text="Resend confirmation email"
        isSubmitting={isSubmitting}
        className="mb-[21px] mt-[15px]"
        onClick={resendEmail}
      />
    </>
  );
}
