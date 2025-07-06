import { useUser } from "../../../../../../../../contexts/UserProvider";
import CaretIcon from "@/public/svg/caret.svg";
import Image from "next/image";
import InputTitle from "../../../../../../../../components/shared/InputTitle";
import SelectInput from "../../../../../../../../components/shared/SelectInput";
import NumberInput from "../../../../../../../../components/shared/NumberInput";
import { Option } from "../../../../../_common/utils/form";
import { useMemo } from "react";
import { CampaignFormContext } from "../useCampaignForm";
import { useFormContext } from "react-hook-form";
import { Button } from "../../../../../../../../components/shared/Button";
import { RFC } from "@/types";
import Link from "next/link";

const Step1: RFC<Props> = ({ index, onStep }) => {
  const user = useUser();
  const { ...form } = useFormContext() as CampaignFormContext;
  const errors = form.formState.errors;
  const isIndividual = user?.userType == "individual";
  const currency = form.watch("currency");

  const currencySymbol = useMemo(() => {
    const currencyLabel = currencies.find((c) => c.value === currency)!;
    // return (currencyLabel?.label?.match(/\((.)\)/) || [])[1]
    return currencyLabel?.label?.slice(-3)?.at(1);
  }, [currency]);

  const nextStep = () => {
    const currency = form.getValues("currency");
    const fundingGoal = form.getValues("fundingGoal");
    const isInvalid = !currency || !fundingGoal;

    if (!isInvalid) {
      onStep(index + 1);
    } else {
      form.trigger("currency");
      form.trigger("fundingGoal");
    }
  };

  return (
    <div className="pt-10 pb-6">
      {/* FUNDRAISE */}
      <details
        open
        style={{ paddingTop: isIndividual ? 8 : 0 }}
        className="group open:mb-10 md:open:mb-14">
        <summary
          hidden={isIndividual}
          className={
            (isIndividual ? "hidden" : "flex") +
            " gap-[10px] text-primary cursor-pointer mb-2"
          }>
          Fundraise
          <Image src={CaretIcon} alt="" className="group-open:-scale-y-[1]" />
        </summary>

        {/* currency */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle
            title="Currency"
            detail="Select the currency type for the fundraiser."
          />
          <div className="max-w-lg">
            <SelectInput
              name="currency"
              options={currencies}
              rules={{
                required: "Currency is required"
              }}
              error={errors.currency}
              ariaLabel="Currency"
            />
          </div>
        </div>

        {/* set your funding goal */}
        <div className="grid md:grid-cols-[minmax(200px,_350px)_minmax(210px,_1fr)] gap-y-4 gap-x-[25px] mb-[25px]">
          <InputTitle
            title="Set Your Funding Goal"
            detail="You can always adjust your goal as your campaign progresses."
          />
          <div className="max-w-lg">
            <NumberInput
              name="fundingGoal"
              rules={{
                required: "Funding goal is required"
              }}
              error={errors.fundingGoal}
              prefix={currencySymbol}
            />
          </div>
        </div>
      </details>

      <div className="flex flex-col lg:flex-row justify-between border-t border-t-[#E4E7EC]">
        <div className="grow lg:max-w-[435px] text-sm text-[#A75003] bg-[#FEF0C7] rounded-lg px-5 py-4 mt-9">
          To withdraw funds, you must complete your KYC registration and
          conclude your campaign.{" "}
          <Link
            href="/settings/verification"
            className="
            text-[#A75003] font-semibold underline">
            Click here
          </Link>{" "}
          to proceed with KYC registration if you have not done so yet.
        </div>

        <Button
          text={"Continue"}
          onClick={nextStep}
          className="mt-[30px] grow lg:max-w-[220px] rounded-lg justify-center"
        />
      </div>
    </div>
  );
};

export default Step1;

interface Props {
  index: number;
  onStep: (step: number) => void;
}

const currencies = [
  Option("", "Select a currency...", true),
  Option("naira", "Naira (₦)")
  // Option("dollar", "Dollar ($)"),
];
