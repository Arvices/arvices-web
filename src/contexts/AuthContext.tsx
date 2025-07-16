import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export type accountTypeVal = "client" | "provider" | undefined;

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    token: string,
    email: string,
    userID: string,
    accountType: accountTypeVal,
  ) => void;
  logout: () => void;
  saveProfile: (profile: any) => void;
  user: string;
  email: string;
  token: string;
  accountType: accountTypeVal;
  isProvider: boolean;
  isClient: boolean;
}

const dummyLogin = (): void => {};

const dummyLogout = (): void => {};

const dummySaveProfile = (): void => {};

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  login: dummyLogin,
  logout: dummyLogout,
  saveProfile: dummySaveProfile,
  user: "",
  email: "",
  token: "",
  accountType: undefined,
  isProvider: false,
  isClient: false,
};

// Create the context with initial values
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface TokenExpiryInfo {
  expired: boolean;
  hours: number;
  days: number;
}

const tokenExpiresIn = (exp: number): TokenExpiryInfo => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const oneDayInSeconds = 24 * 60 * 60;

  // Treat token as expiring 1 day earlier than actual exp
  const adjustedExp = exp - oneDayInSeconds;
  const diffInSeconds = adjustedExp - nowInSeconds;

  if (diffInSeconds <= 0) {
    return {
      expired: true,
      hours: 0,
      days: 0,
    };
  }

  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / (3600 * 24));

  return {
    expired: false,
    hours,
    days,
  };
};

// AuthProvider component to wrap your app and provide context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const accessToken = localStorage.getItem("access_token");
  const email_saved = localStorage.getItem("user_email");
  const userID = localStorage.getItem("user_id");

  let isAuthenticated = false;
  const [email, setEmail] = useState(email_saved || "");
  const [accountType, setAccountType] = useState<accountTypeVal>();
  const isProvider = accountType === "provider";
  const isClient = accountType === "client";
  const [token, setToken] = useState(accessToken || "");
  const [user, setUser] = useState(userID || "");

  if (token) {
    const decoded = jwtDecode(token);
    let tokenStatus = tokenExpiresIn(decoded.exp as number);
    console.log({ tokenStatus });
    isAuthenticated = !!token && !tokenExpiresIn(decoded.exp as number).expired;
  }

  //default auth state is not authenticated. then use effect checks if there is an accessToken

  const login = (
    accessToken: string,
    email: string,
    userID: string,
    accountType: accountTypeVal,
  ) => {
    setEmail(email);
    setToken(accessToken);
    setUser(userID);
    setAccountType(accountType);
    window.localStorage.setItem("access_token", accessToken);
    window.localStorage.setItem("user_email", email);
    window.localStorage.setItem("user_id", userID);
  };

  const saveProfile = (profile: any) => {
    window.localStorage.setItem("user_profile", JSON.stringify(profile));
  };

  const clearProfile = () => {
    window.localStorage.setItem("user_profile", "");
  };

  const logout = () => {
    setToken("");
    window.localStorage.setItem("access_token", "");
    window.localStorage.setItem("token_expires_at", "");
    window.localStorage.setItem("user_email", "");
    window.localStorage.setItem("user_id", "");
    clearProfile();
    // navigate to homepage.
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const email = localStorage.getItem("user_email");
    const userID = localStorage.getItem("user_id");
    const expiresAt = Number(localStorage.getItem("token_expires_at"));
    let bool = expiresAt && new Date().getTime() < expiresAt;

    if (accessToken && email && userID && bool) {
      setEmail(email);
      setToken(accessToken);
      setUser(userID);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        saveProfile,
        logout,
        user,
        email,
        token,
        accountType,
        isProvider,
        isClient,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
