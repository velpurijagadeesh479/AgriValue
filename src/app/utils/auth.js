import { clearStoredSession, getStoredToken, setStoredSession } from "../lib/api";

export const AUTH_ROLES = {
  ADMIN: "admin",
  FARMER: "farmer",
  BUYER: "buyer",
};

export const saveAuthData = (session) => {
  setStoredSession(session);
};

export const getAuthData = () => {
  const authUser = localStorage.getItem("authUser");
  return authUser ? JSON.parse(authUser) : null;
};

export const isAuthenticated = () => Boolean(getStoredToken());

export const logout = () => {
  clearStoredSession();
};

export const getUserRole = () => {
  const authData = getAuthData();
  return authData?.role || null;
};

export const hasRole = (role) => getUserRole() === role;
