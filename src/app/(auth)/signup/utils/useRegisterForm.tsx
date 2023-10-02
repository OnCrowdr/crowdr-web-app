import { useState, Dispatch, SetStateAction } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { UseFormReturn } from "react-hook-form/dist/types";

import { RFC } from "@/types/Component";

const RegisterFormContext: RFC = ({ children }) => {
  const [formPage, setFormPage] = useState<FormPage>("intro")
  const formContext: RegisterFormContext = { formPage, setFormPage, ...useForm<FormFields>(config) };

  return <FormProvider {...formContext}>{children}</FormProvider>;
};

export default RegisterFormContext;
export type { RegisterFormContext, FormFields }

const config: UseFormConfig = {
  defaultValues: {
    userType: "non-profit",
    interests: [],
    fullName: "",
    organizationName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    referrer: "google",
    termsAccepted: false,
  },
  mode: 'onChange'
}

type FormPage = "intro" | "account" | "confirm"
type FormPageSetter = Dispatch<SetStateAction<FormPage>>
type UseFormConfig = Parameters<typeof useForm<FormFields>>[0]
type FormFields = {
  userType:             string;
  interests:            string[];
  fullName:             string;
  organizationName:     string;
  email:                string;
  password:             string;
  confirmPassword:      string;
  gender:               string;
  referrer:             string;
  termsAccepted:        boolean;
}
type RegisterFormContext = {
  formPage: FormPage
  setFormPage: FormPageSetter
} & UseFormReturn<FormFields>
