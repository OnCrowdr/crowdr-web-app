"use client"
import { useState, Dispatch, SetStateAction } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

const LoginFormContext: RFC = ({ children }) => {
  const [formPage, setFormPage] = useState<FormPage>("login");
  const formContext: LoginFormContext = {
    formPage,
    setFormPage,
    ...useForm<FormFields>(config)
  };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default LoginFormContext;
export type { LoginFormContext, FormFields };

const config: UseFormConfig = {
  defaultValues: {
    email: "",
    password: "",
    confirmPassword: ""
  },
  mode: "onChange"
};

type FormPage = "login" | "forgot-password" | "reset-password";
type FormPageSetter = Dispatch<SetStateAction<FormPage>>;
type LoginFormProps = { children: React.ReactNode };
type RFC = React.FC<LoginFormProps>;
type UseFormConfig = Parameters<typeof useForm<FormFields>>[0];
type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};
type LoginFormContext = {
  formPage: FormPage;
  setFormPage: FormPageSetter;
} & UseFormReturn<FormFields>;
