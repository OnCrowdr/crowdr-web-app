"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "../components/shared/Button";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen font-satoshi">
      <div className="text-lg md:text-2xl text-[#000000] font-medium text-center max-w-[450px] mx-auto flex flex-col items-center gap-4">
        <h1 className="text-lg md:text-2xl text-[#000000] font-medium text-center">
          {error.message ||
            "Oops! We checked our pockets, this page isn’t there."}
        </h1>
        <p className="text-base text-[#252525] font-normal">
          This error might be due to your internet provider or VPN. Try hitting
          refresh. Still not working? No stress — shoot us a message at{" "}
          <a className="text-[#00B964]" href="mailto:support@oncrowdr.com">
            support@oncrowdr.com
          </a>{" "}
          and we’ll get it sorted.
        </p>

        <Button
          className=""
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => router.push("/")
          }
          text="Back to Home"
        />
      </div>
    </div>
  );
}
