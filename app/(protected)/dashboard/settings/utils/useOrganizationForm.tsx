import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { RFC } from "@/types";

const OrganizationFormContext: RFC = ({ children }) => {
  const formContext: OrganizationFormContext = {
    ...useForm<FormFields>(config),
  };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default OrganizationFormContext;
export type { OrganizationFormContext, FormFields };

const config: UseFormConfig = {
  defaultValues: {},
  mode: "onChange",
};

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0];
type FormFields = {
  cacNumber: string;
  orgLocation: string;
  publicUrl: string;
  profileImage: [File];
};
type OrganizationFormContext = UseFormReturn<FormFields>;
