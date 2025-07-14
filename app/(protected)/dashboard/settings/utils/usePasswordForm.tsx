import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { RFC } from "@/types";

const PasswordFormContext: RFC = ({ children }) => {
  const formContext: PasswordFormContext = {
    ...useForm<FormFields>(config),
  };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default PasswordFormContext;
export type { PasswordFormContext, FormFields };

const config: UseFormConfig = {
  defaultValues: {},
  mode: "onChange",
};

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0];
type FormFields = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
type PasswordFormContext = UseFormReturn<FormFields>;
