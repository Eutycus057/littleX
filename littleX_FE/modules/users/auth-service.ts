import { UserNode } from "@/nodes/user-node";
import { private_api, public_api } from "../../_core/api-client";
import { localStorageUtil } from "@/_core/utils";
import { APP_KEYS } from "@/_core/keys";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials { }

interface AuthResponse {
  token: string;
  user: UserNode;
}

export const AuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await public_api.post("/user/login", credentials);

    let data = response.data;
    // Handle Jaseci reports wrapper if present
    if (data.reports && Array.isArray(data.reports) && data.reports.length > 0) {
      data = data.reports[0];
    }

    if (data.token) {
      localStorageUtil.setItem(APP_KEYS.TOKEN, data.token);
      localStorageUtil.setItem(APP_KEYS.USER, data.user);
    }

    return data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await public_api.post("/user/register", data);

    let responseData = response.data;
    // Handle Jaseci reports wrapper if present
    if (responseData.reports && Array.isArray(responseData.reports) && responseData.reports.length > 0) {
      responseData = responseData.reports[0];
    }

    if (responseData.token) {
      localStorageUtil.setItem(APP_KEYS.TOKEN, responseData.token);
    }

    return responseData;
  },

  logout: async (): Promise<void> => {
    localStorageUtil.removeItem(APP_KEYS.TOKEN);
    localStorageUtil.removeItem(APP_KEYS.USER);
    localStorageUtil.removeItem(APP_KEYS.NOTIFICATIONS);
  },

  changePassword: async (
    oldPassword: string,
    newPassword: string
  ): Promise<void> => {
    await public_api.post("/user/change_password", {
      old_password: oldPassword,
      new_password: newPassword,
    });
  },

  forgotPassword: async (email: string): Promise<void> => {
    await public_api.post("/user/forgot_password", { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await public_api.post("/user/reset_password", { code: token, password });
  },

  getCurrentUser: (): UserNode | null => {
    const token = localStorageUtil.getItem(APP_KEYS.TOKEN);
    const user: UserNode | null = localStorageUtil.getItem(APP_KEYS.USER);
    if (!token || !user) {
      return null;
    }
    return {
      id: user.id || "",
      email: user.email || "",
      root_id: user.root_id || "",
      is_activated: user.is_activated || false,
      is_admin: user.is_admin || false,
      expiration: user.expiration || 0,
      state: user.state || "",
      avatar:
        user.avatar ||
        "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png",
    };
  },
};
