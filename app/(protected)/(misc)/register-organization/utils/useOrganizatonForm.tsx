import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

const OrganizationFormContext: RFC = ({ children }) => {
  const formContext: OrganizationFormContext = { ...useForm<FormFields>(config) };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export { OrganizationFormContext }

const config: UseFormConfig = {
  defaultValues: {
    cacNumber: "",
    state: "",
    publicUrl: ""
  },
  mode: 'onChange'
}

type RegisterFormProps = {children: React.ReactNode}
type RFC = React.FC<RegisterFormProps>
type UseFormConfig = Parameters<typeof useForm<FormFields>>[0]
export type FormFields = {
  image:                FileList;
  cacNumber:            string;
  state:                string;
  publicUrl:            string;
}
type OrganizationFormContext = UseFormReturn<FormFields>
