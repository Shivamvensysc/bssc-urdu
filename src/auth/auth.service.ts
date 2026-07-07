import {
  signIn,
  signOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";

export const AuthService = {
  async login(username: string, password: string) {
    return signIn({
      username,
      password,
    });
  },

  async logout() {
    return signOut();
  },

  async currentUser() {
    return getCurrentUser();
  },

  async getAccessToken() {
    const session = await fetchAuthSession();

    return (
      session.tokens?.accessToken?.toString() || ""
    );
  },

  async isAuthenticated() {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};