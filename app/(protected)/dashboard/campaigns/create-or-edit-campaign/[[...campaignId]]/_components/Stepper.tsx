import { RFC } from "@/types";
import { Fragment } from "react";
import { IconType } from "react-icons/lib";

const Stepper: RFC<Props> = ({ value, steps, setStep }) => {
  return (
    <div className="grid place-items-center mb-10 px-2 lg:px-0">
      <div className="flex items-center w-full max-w-[713px]">
        {steps.map((step, index) => {
          const active = value >= index;
          const prop = index < 2 ? "fill" : "stroke";
          const props = { [prop]: active ? "#008347" : "#344054" };

          return (
            <Fragment key={index}>
              {index !== 0 && (
                <div
                  className="grow h-0.5"
                  style={{ background: active ? "#8ADFB8" : "#EAECF0" }}
                />
              )}

              <div
                className="relative rounded-lg border border-[#EAECF0] p-2.5 cursor-pointer"
                style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                onClick={() => setStep(index)}>
                <step.icon size={20} {...props} />
                <div
                  className="absolute -bottom-[44px] lg:-bottom-[34px] left-[50%] -translate-x-[50%] font-semibold text-sm text-center lg:whitespace-nowrap"
                  style={{ color: active ? "#008347" : "#344054" }}>
                  {step.label}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

interface Props {
  value: number;
  steps: Step[];
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

interface Step {
  label: string;
  icon: IconType;
}
