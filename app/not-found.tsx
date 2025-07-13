"use client"; // Error components must be Client Components

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "../components/Button";
import { useRouter } from "next/navigation";

export default function NotFound({
  errorTitle,
  errorMessage,
  onClick,
  clickMessage
}: {
  errorTitle?: string;
  errorMessage?: string;
  onClick?: () => void;
  clickMessage?: string;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen py-10">
      <Image
        src={"/svg/404.svg"}
        alt="error"
        width={480}
        height={500}
        className="w-64 md:w-[490px]"
      />
      <div className="text-lg md:text-2xl text-[#000000] font-medium text-center max-w-[450px] mx-auto flex flex-col items-center gap-4 px-4">
        <h1 className="text-xl md:text-3xl text-[#000000] font-medium text-center mt-2">
          {errorTitle || "Oops! We checked our pockets, this page isn’t there."}
        </h1>
        {errorMessage ? (
          <p className="text-base text-[#252525] font-normal">{errorMessage} If this issue persists, please contact our support team <a className="text-[#00B964]" href="mailto:support@oncrowdr.com">
              support@oncrowdr.com
            </a>.</p>
        ) : (
          <p className="text-base text-[#252525] font-normal">
            This error might be due to your internet provider or VPN. Try
            hitting refresh. Still not working? No stress — shoot us a message
            at{" "}
            <a className="text-[#00B964]" href="mailto:support@oncrowdr.com">
              support@oncrowdr.com
            </a>{" "}
            and we’ll get it sorted.
          </p>
        )}

        <Button
          className=""
          text="Back to Home"
          onClick={() => {
            router.push("/"); // Redirect to the home page
          }}
        />
      </div>
    </div>
  );
}
