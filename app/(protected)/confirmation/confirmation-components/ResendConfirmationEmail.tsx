"use client";
import { getUser } from "../../../api/user/getUser";
import OldButton from "../../../common/components/OldButton";
import { useToast } from "../../../common/hooks/useToast";
import { extractErrorMessage } from "../../../../utils/extractErrorMessage";
import makeRequest from "../../../../utils/makeRequest";
import { useState } from "react";
import { resendVerificationAction } from "./actions";

export default function ResendConfirmationEmail() {
  const toast = useToast();
  const [isSubmitting, setSubmitting] = useState(false);
  
  const resendEmail = async () => {
    try {
      setSubmitting(true);
      const user = (await getUser())!;
      
      // Call the server action
      const result = await resendVerificationAction(user.token!);
      
      if (result.success) {
        toast({ title: "Success!", body: result.message, type: "success" });
      } else {
        toast({ title: "Oops!", body: result.error, type: "error" });
      }
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