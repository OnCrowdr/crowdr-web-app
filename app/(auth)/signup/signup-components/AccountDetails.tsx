import { useState } from "react";
import Link from "next/link";
import Select from "react-select";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { RegisterFormContext } from "../utils/useRegisterForm";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { CgSpinner } from "react-icons/cg";
import { isProd } from "@/config";
import PhoneNumberInput from "@/components/PhoneNumberInput";

const AccountDetails = () => {
  const {
    setFormPage,
    register,
    control,
    formState: { errors, isValid, isSubmitting },
    setValue,
  } = useFormContext() as RegisterFormContext;
  const [userType] = useWatch({ control, name: ["userType"] });
  const [passIsVisible, setPassIsVisible] = useState(false);
  const [confirmPassIsVisible, setConfirmPassIsVisible] = useState(false);
  const emailRegex = isProd ? /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/ : /^[\w\.\-+]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;;

  const prevPage = () => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    setFormPage("intro");
  };

  const handlePhoneChange = (value: string) => {
    setValue('phoneNumber', value, { shouldValidate: true });
  };


  return (
    <section>
      <div className="max-w-[525px] mx-auto py-2">
        <div className="flex flex-col py-[21px] md:py-[56px] px-5">
          <h1 className="text-[#0B5351] text-[18px] md:text-[32px] font-[600] mb-[8px] md:mb-[15px]">
            Welcome
          </h1>
          <h2 className="text-[#0B5351] text-[14px] md:text-[20px] md:font-[600] mb-[15px]">
            Proceed by providing these details.
          </h2>

          <div className="max-w-[473px]">
            {userType == "individual" && (
              <div className="flex flex-col mb-[9px]">
                <label
                  htmlFor="fullName"
                  className="text-[14px] text-[#344054] mb-[6px]">
                  Full name
                </label>
                <input
                  type="text"
                  {...register("fullName", {
                    required: { value: true, message: "Full name is required" }
                  })}
                  id="fullName"
                  placeholder="Enter your full name"
                  className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
                />
                {errors.fullName && (
                  <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                    {errors.fullName?.message}
                  </span>
                )}
              </div>
            )}

            {userType == "non-profit" && (
              <div className="flex flex-col mb-[9px]">
                <label
                  htmlFor="organization_name"
                  className="text-[14px] text-[#344054] mb-[6px]">
                  Organization name
                </label>
                <input
                  type="text"
                  {...register("organizationName", {
                    required: {
                      value: true,
                      message: "Organization name is required"
                    }
                  })}
                  id="organization_name"
                  placeholder="Enter your organization name"
                  className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
                />
                {errors.organizationName && (
                  <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                    {errors.organizationName?.message}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col mb-[9px]">
              <label
                htmlFor="email_address"
                className="text-[14px] text-[#344054] mb-[6px]">
                Email address
              </label>
              <input
                type="text"
                {...register("email", {
                  required: { value: true, message: "Email is required" },
                  pattern: { value: emailRegex, message: "Enter a valid email" }
                })}
                id="email_address"
                placeholder="Enter your email"
                className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] px-[14px]"
              />
              {errors.email && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.email?.message}
                </span>
              )}
            </div>

            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: { value: true, message: "Phone number is required" }
              }}
              render={({ field }) => (
                <PhoneNumberInput
                  label="Phone number"
                  name="phoneNumber"
                  id="phone_number"
                  value={field.value}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  required={true}
                  error={errors.phoneNumber?.message as string}
                />
              )}
            />

            <div className="flex flex-col mb-[9px]">
              <label
                htmlFor="password"
                className="text-[14px] text-[#344054] mb-[6px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={passIsVisible ? "text" : "password"}
                  {...register("password", {
                    required: { value: true, message: "Password is required" },
                    minLength: {
                      value: 8,
                      message: "Must be at least 8 characters."
                    }
                  })}
                  id="password"
                  placeholder="Create a password"
                  className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] pl-[14px] pr-10 w-full"
                />
                {passIsVisible && (
                  <span
                    onClick={() => setPassIsVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <LuEye size="1.25rem" title="Hide password" />
                  </span>
                )}
                {!passIsVisible && (
                  <span
                    onClick={() => setPassIsVisible(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <LuEyeOff size="1.25rem" title="Show password" />
                  </span>
                )}
              </div>
              {errors.password && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.password?.message}
                </span>
              )}
            </div>

            <div className="flex flex-col mb-[9px]">
              <label
                htmlFor="confirm_password"
                className="text-[14px] text-[#344054] mb-[6px]">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  type={confirmPassIsVisible ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: true,
                    validate: {
                      value: (confirmPassword, { password }) =>
                        confirmPassword === password || "Passwords do not match"
                    }
                  })}
                  id="confirm_password"
                  placeholder="Confirm password"
                  className="text-[15px] rounded-lg border border-[#D0D5DD] py-[10px] pl-[14px] pr-10 w-full"
                />
                {confirmPassIsVisible && (
                  <span
                    onClick={() => setConfirmPassIsVisible(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <LuEye size="1.25rem" title="Hide password" />
                  </span>
                )}
                {!confirmPassIsVisible && (
                  <span
                    onClick={() => setConfirmPassIsVisible(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    <LuEyeOff size="1.25rem" title="Show password" />
                  </span>
                )}
              </div>
              {errors.confirmPassword && (
                <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                  {errors.confirmPassword?.message}
                </span>
              )}
            </div>

            {userType == "individual" && (
              <div className="flex flex-col mb-[9px]">
                <label
                  htmlFor="gender"
                  className="text-[14px] text-[#344054] mb-[6px]">
                  Gender
                </label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{
                    required: { value: true, message: "Select an option" }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      id="gender"
                      options={genderOptions}
                      value={genderOptions.find((g) => g.value === value)}
                      isSearchable={false}
                      isClearable={false}
                      onChange={(g: any) => onChange(g!.value)}
                      placeholder="Select your gender"
                    />
                  )}
                />
                {errors.gender && (
                  <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                    {errors.gender?.message}
                  </span>
                )}
              </div>
            )}

            {userType == "individual" && (
              <div className="flex flex-col mb-[9px]">
                <label
                  htmlFor="referrer"
                  className="text-[14px] text-[#344054] mb-[6px]">
                  How did you hear about us?{" "}
                  <span className="opacity-[0.44]">(Optional)</span>
                </label>
                <Controller
                  name="referrer"
                  control={control}
                  rules={{
                    required: { value: true, message: "Select an option" }
                  }}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      id="referrer"
                      options={referrerOptions}
                      defaultValue={referrerOptions[0]}
                      isClearable={false}
                      value={referrerOptions.find((g) => g.value === value)}
                      onChange={(g: any) => onChange(g!.value)}
                    />
                  )}
                />
                {errors.referrer && (
                  <span className="text-[13px] text-[#667085] opacity-[0.67] mt-[6px]">
                    {errors.referrer?.message}
                  </span>
                )}
              </div>
            )}

            <div className="flex gap-x-2 mb-[22px]">
              <input
                type="checkbox"
                {...register("termsAccepted", { required: true })}
                id="terms_conditions"
                className="rounded-[4px] border border-[#D0D5DD] w-4 h-4"
              />
              <p className="text-[14px] text-[#344054] font-[500]">
                I have read, understood and I agree to{" "}
                <span className="text-[#003D66]">Crowdr’s</span>{" "}
                <Link href="/policies" target="_blank" className="underline">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/policies" target="_blank" className="underline">
                  Terms and conditions
                </Link>
                .
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`${
                isValid && !isSubmitting ? "opacity-100" : "opacity-50"
              } flex items-center justify-center bg-[#068645] cursor-pointer text-white text-[14px] md:text-base font-[400] md:font-[500] leading-[24px] rounded-[10px] w-full py-[12px] px-[20px] mb-[21px]`}>
              Continue{" "}
              {isSubmitting && (
                <span>
                  <CgSpinner
                    size="1.5rem"
                    className="animate-spin icon opacity-100 ml-2.5"
                  />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => prevPage()}
              className="opacity-50 text-[#000] text-[14px] md:text-base font-[400] md:font-[500] leading-[24px] rounded-[10px] w-full px-[20px]">
              Go back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountDetails;

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
];

const referrerOptions = [
  { value: "google", label: "Google" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  {value: 'wordofmouth', label: 'Word of mouth'},
  { value: "other", label: "Other" }
];
