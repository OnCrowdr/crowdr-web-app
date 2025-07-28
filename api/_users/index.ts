import api from "..";
import {
  IPostResendVerificationLinkBody,
  IPostResendVerificationLinkResponse
} from "./models/PostResendVerificationLink";
import { IPostSignInBody, IPostSignInResponse } from "./models/PostSignIn";
import { IPostSignUpBody, IPostSignUpResponse } from "./models/PostSignUp";
import { IPostVerifyEmailHeaders } from "./models/PostVerifyEmail";

const signup = async (body: IPostSignUpBody) => {
  const url = `/users/signup`;

  try {
    const { data } = await api.post<IPostSignUpResponse>(url, body);
    return data;
  } catch (error) {
    throw error;
  }
};

const signin = async (body: IPostSignInBody) => {
  const url = `/users/signin`;

  try {
    const { data } = await api.post<IPostSignInResponse>(url, body);
    return data.data;
  } catch (error) {
    throw error;
  }
};

const resendVerificationLink = async (
  body: IPostResendVerificationLinkBody
) => {
  const url = `/users/resend-verification-link`;

  try {
    const { data } = await api.post<IPostResendVerificationLinkResponse>(
      url,
      body
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const verifyEmail = async (headers: IPostVerifyEmailHeaders) => {
  const url = `/users/verify-email`;

  try {
    const { data } = await api.post<any>(url, null, { headers });
    return data;
  } catch (error) {
    throw error;
  }
};

export default { signup, signin, resendVerificationLink, verifyEmail };
