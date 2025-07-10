import { useMemo } from "react";
import Image from "next/image";
import { useFormContext, useWatch } from "react-hook-form";
import { RegisterFormContext } from "../utils/useRegisterForm";
import { campaignCategories as interests } from "../../../../utils/campaignCategory";

const Intro = () => {
  const { setFormPage, register, control } =
    useFormContext() as RegisterFormContext;
  const [userType, pickedInterests] = useWatch({
    control,
    name: ["userType", "interests"]
  });
  const hasPickedEnoughInterests = useMemo(
    () => pickedInterests?.length > 0 && pickedInterests?.length <= 3,
    [pickedInterests]
  );
  const validatePick = (id: string, event: any) => {
    if (pickedInterests?.length == 3 && !pickedInterests?.includes(id))
      event.preventDefault();
  };

  const nextPage = () => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
    setFormPage("account");
  };

  return (
    <section>
      <div className="max-w-[525px] mx-auto py-2">
        <div className="flex flex-col py-[21px] md:py-[56px] px-5">
          <h1 className="text-[#0B5351] text-[18px] md:text-[32px] font-[600] mb-[8px] md:mb-[15px]">
            Start your <span className="text-[#FF5200]">Crowdr</span> adventure
            now!
          </h1>

          <div className="max-w-[473px]">
            <h2 className="text-[#0B5351] text-[14px] md:text-[20px] md:font-[600] mb-[15px]">
              Who are you?
            </h2>
            <div id="account_type">
              <label
                htmlFor="individual"
                className={
                  (userType == "individual" ? "bg-[#068645]" : "bg-[#F8F8F8]") +
                  " block rounded-[8px] cursor-pointer py-[18px] px-[20px] mb-[11px]"
                }>
                <p
                  className={
                    (userType == "individual"
                      ? "text-white"
                      : "text-[#344054]") +
                    " text-[14px] md:text-base font-[600] mb-2"
                  }>
                  Individual
                </p>
                <p
                  className={
                    (userType == "individual"
                      ? "text-white"
                      : "text-[#667085]") +
                    " text-[12px] md:text-[13px] font-[300]"
                  }>
                  Select this if you’re a person looking to volunteer, donate or
                  raise funds.
                </p>
                <input
                  type="radio"
                  {...register("userType")}
                  id="individual"
                  value="individual"
                  className="hidden"
                />
              </label>
              <label
                htmlFor="non-profit"
                className={
                  (userType == "non-profit" ? "bg-[#068645]" : "bg-[#F8F8F8]") +
                  " block rounded-[8px] cursor-pointer py-[18px] px-[20px] "
                }>
                <p
                  className={
                    (userType == "non-profit"
                      ? "text-white"
                      : "text-[#344054]") +
                    " text-[14px] md:text-base font-[600] mb-2"
                  }>
                  Organization
                </p>
                <p
                  className={
                    (userType == "non-profit"
                      ? "text-white"
                      : "text-[#667085]") +
                    " text-[12px] md:text-[13px] font-[300]"
                  }>
                  Select this if you're an organization
                  <span className="md:hidden text-inherit">
                    {" "}
                    looking to raise funds for your cause
                  </span>
                  .
                </p>
                <input
                  type="radio"
                  {...register("userType")}
                  id="non-profit"
                  value="non-profit"
                  className="hidden"
                />
              </label>
            </div>

            <h2 className="text-[#0B5351] text-[20px] font-[600] my-[15px] hidden md:block">
              What are you primarily interested in?
            </h2>
            <h2 className="text-[#0B5351] text-[14px] font-[400] my-[18px] md:hidden">
              Which industry are you primarily interested in?
            </h2>
            <div
              id="interests"
              className="flex flex-wrap gap-y-[10px] mb-[37px] -mr-[6px]">
              {interests.map(({ value, label, icon }) => (
                <label
                  key={value}
                  htmlFor={value}
                  onClick={(e) => validatePick(value, e)}
                  className={
                    ((pickedInterests || [])?.includes(value)
                      ? "bg-[#068646]"
                      : "bg-[#F8F8F8]") +
                    " flex justify-center items-center gap-x-[5px] rounded-full cursor-pointer py-[8px] px-[21px] mr-[5.5px]"
                  }>
                  {icon && (
                    <Image
                      src={`svg/emoji/${icon}.svg`}
                      alt={icon}
                      width={15}
                      height={15}
                    />
                  )}
                  <span
                    className={
                      ((pickedInterests || [])?.includes(value)
                        ? "text-[#F8F8F8]"
                        : "text-[#0B5351]") + " text-[12px] md:text-base"
                    }>
                    {label}
                  </span>
                  <input
                    type="checkbox"
                    {...register("interests")}
                    id={value}
                    value={value}
                    className="hidden"
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              onClick={() => nextPage()}
              disabled={!hasPickedEnoughInterests}
              className={`${
                hasPickedEnoughInterests ? "opacity-100" : "opacity-50"
              } bg-[#068645] cursor-pointer text-white text-[14px] md:text-base font-[400] md:font-[500] leading-[24px] rounded-[10px] w-full py-[12px] px-[20px]`}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
