"use client";
import FormPage from "./register-organization-components/FormPage";
import Topbar from "../../../(auth)/signup/signup-components/Topbar";
import { OrganizationFormContext } from "./utils/useOrganizatonForm";

const Register =  () => {

  return (
    <div>
     <Topbar showSignIn={false}/>
      <OrganizationFormContext>
        <FormPage />
      </OrganizationFormContext>
    </div>
  );
};

export default Register;
