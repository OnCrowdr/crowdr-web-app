import { useFormContext } from "react-hook-form";
import { LoginFormContext } from "../../_hooks/useLoginForm";
import OldButton from "../../../../components/shared/OldButton";

const ResetPassword = () => {
  const {
    register,
    formState: { errors, isValid, isSubmitting },
  } = useFormContext() as LoginFormContext;

  return (
    <section>
      <div className="max-w-[525px] mx-auto py-2">
        <div className="flex flex-col py-[21px] md:py-[56px] px-5">
          <h1 className="text-[#0B5351] text-[18px] md:text-[32px] font-[600] mb-[8px] md:mb-[15px]">
            Reset Password
          </h1>
          <div className="max-w-[473px]">
            <div className="flex flex-col mb-[9px]">
              <label
                htmlFor="password"
                className="text-[14px] text-[#344054] mb-[6px]"
              >
                New Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: { value: true, message: "Password is required" },
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters.",
                  },
                })}
                id="password"
                placeholder="Create a password"
                className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
              />
              {errors.password && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.password?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-[9px]">
              <label
                htmlFor="confirmPassword"
                className="text-[14px] text-[#344054] mb-[6px]"
              >
                Confirm Password*
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: { value: true, message: "Password is required" },
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters.",
                  },
                })}
                id="confirmPassword"
                placeholder="Confirm password"
                className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
              />
              {errors.confirmPassword && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.confirmPassword?.message}
                </span>
              )}
            </div>
            <OldButton
              isValid={isValid}
              text="Continue"
              isSubmitting={isSubmitting}
              className="mb-[21px] mt-[15px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
