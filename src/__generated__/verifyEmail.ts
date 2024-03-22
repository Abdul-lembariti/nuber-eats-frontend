/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { VerifyEmailInPut } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: verifyEmail
// ====================================================

export interface verifyEmail_verifyEmail {
  __typename: "VerifyEmailOutPut";
  ok: boolean | null;
  error: string | null;
}

export interface verifyEmail {
  verifyEmail: verifyEmail_verifyEmail;
}

export interface verifyEmailVariables {
  input: VerifyEmailInPut;
}
