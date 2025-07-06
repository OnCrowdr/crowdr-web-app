import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { RFC } from "@/types";

const AccountFormContext: RFC = ({ children }) => {
  const formContext: AccountFormContext = {
    ...useForm<FormFields>(config),
  };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default AccountFormContext;
export type { AccountFormContext, FormFields };

const config: UseFormConfig = {
  defaultValues: {},
  mode: "onChange",
};

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0];
type FormFields = {
  accountNumber: string;
  bankName: string;
  accountName: string;
  accountType: string;
};
type AccountFormContext = UseFormReturn<FormFields>;
