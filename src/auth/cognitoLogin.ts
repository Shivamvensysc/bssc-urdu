import {
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import type { CognitoUserSession } from "amazon-cognito-identity-js";
import { userPool } from "./cognito";

export interface LoginResult {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  username: string;
}

export interface LogoutResult {
  success: true;
}

/**
 * Logs a user in with Username (whatever your app treats as the Cognito
 * Username — registration number, email, etc.) + Password.
 * Pure client-side SRP auth via amazon-cognito-identity-js — no backend needed,
 * same pattern already used for signUp/confirmRegistration in cognito.ts.
 */
export const login = (username: string, password: string): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({ Username: username, Password: password });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
          username,
        });
      },
      onFailure: (err) => reject(err),
      newPasswordRequired: () => {
        reject(new Error("This account requires setting a new password before logging in."));
      },
    });
  });
};

/** Logs the currently signed-in Cognito user out (clears local session). */
export const logout = (): LogoutResult => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
  return { success: true };
};

/**
 * Returns the current valid session if one exists (e.g. on app load, to check
 * "is this user already logged in"), or null if there isn't one / it's expired.
 */
export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }
    cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(session && session.isValid() ? session : null);
    });
  });
};