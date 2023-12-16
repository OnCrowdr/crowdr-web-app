import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { RFC } from "@/app/common/types";

const ProfileFormContext: RFC = ({ children }) => {
  const formContext: ProfileFormContext = {
    ...useForm<FormFields>(config),
  };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default ProfileFormContext;
export type { ProfileFormContext, FormFields };

const config: UseFormConfig = {
  defaultValues: {},
  mode: "onChange",
};

type UseFormConfig = Parameters<typeof useForm<FormFields>>[0];
type FormFields = {
  cacNumber: number;
  organizationLocation: string;
  publicUrl: string;
  profileImage: File;
};
type ProfileFormContext = UseFormReturn<FormFields>;
