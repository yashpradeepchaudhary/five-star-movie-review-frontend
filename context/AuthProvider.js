import React, { createContext, useEffect, useState } from "react";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";
import { useNavigate } from "react-router-dom";
export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const {updateNotification} = useNotification()

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPanding: true });
    const { error, user } = await signInUser({ email, password });

    if (error) {
      updateNotification('error',error)
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    navigate('/', {replace : true})
    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });

    localStorage.setItem("auth-token", user.token);
  };

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    setAuthInfo({ ...authInfo, isPanding: true });
    const { error, user } = await getIsAuth(token);
    if (error) {
      updateNotification('error',error)
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });

    console.log(authInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
  };

  useEffect(() => {
    isAuth();
  }, []);

  //   handleLogout, isAuth
  return (
    <AuthContext.Provider value={{ authInfo, handleLogin, isAuth, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
