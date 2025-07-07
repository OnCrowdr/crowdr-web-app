import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { LoginFormContext } from "../../_hooks/useLoginForm";
import OldButton from "../../../../components/shared/OldButton";

const ForgotPassword = () => {
  const {
    setFormPage,
    register,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext() as LoginFormContext;
  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  return (
    <section>
      <div className="max-w-[525px] mx-auto py-2">
        <div className="flex flex-col py-[21px] md:py-[56px] px-5">
          <h1 className="text-[#0B5351] text-[18px] md:text-[32px] font-[600] mb-[8px] md:mb-[15px]">
            Forgot your password?
          </h1>
          <h2 className="text-[#0B5351] text-[14px] md:text-[20px] md:font-[600] mb-[15px]">
            Enter your email address and we'll send you a link to reset your
            password.
          </h2>
          <div className="max-w-[473px]">
            <div className="flex flex-col mb-[9px]">
              <label
                htmlFor="emailAddress"
                className="text-[14px] text-[#344054] mb-[6px]"
              >
                Email address
              </label>
              <input
                type="text"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email address is required",
                  },
                  pattern: {
                    value: emailRegex,
                    message: "Enter a valid email",
                  },
                })}
                id="fullname"
                placeholder="Enter your email"
                className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
              />
              {errors.email && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.email?.message}
                </span>
              )}
            </div>
            <OldButton
              isValid={isValid}
              text="Continue"
              isSubmitting={isSubmitting}
              className="mb-[21px] mt-[15px]"
            />
            <Link
              type="button"
              href="login"
              className=" text-[#068645] text-[16px] md:text-base font-[400] md:font-[500] leading-[24px] rounded-[10px] w-full px-[20px] text-center"
            >
              Return to login
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;

