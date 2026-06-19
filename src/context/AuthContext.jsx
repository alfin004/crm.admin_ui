import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi, setUnauthorizedHandler } from "../lib/api";
import { clearStoredToken, getStoredToken, storeToken } from "../lib/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getStoredToken());
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getStoredToken()));

  const clearSession = () => {
    clearStoredToken();
    setToken(null);
    setCurrentUser(null);
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      navigate("/login", { replace: true });
    });
  }, [navigate]);

  useEffect(() => {
    let alive = true;
    if (!token) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    authApi
      .me()
      .then((user) => {
        if (alive) setCurrentUser(user);
      })
      .catch(() => {
        if (alive) clearSession();
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [token]);

  const login = async (credentials) => {
    const response = await authApi.login(credentials);
    storeToken(response.access_token);
    setToken(response.access_token);
    const user = await authApi.me();
    setCurrentUser(user);
    return user;
  };

  const logout = async () => {
    try {
      if (token) await authApi.logout();
    } finally {
      clearSession();
      navigate("/login", { replace: true });
    }
  };

  const value = useMemo(
    () => ({
      token,
      currentUser,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, currentUser, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
