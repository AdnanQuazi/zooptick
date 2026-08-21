import React, { createContext, useState, useEffect } from "react";
import { login, logout , userAuth } from "../Api/api";
import { useNavigate } from "react-router-dom";
import { replace } from "formik";

export const AuthContext = createContext({});

export function AuthContextProvider({ children }) { 
  const BASEURL = "http://localhost:3000"
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchProfile = async () => {
    try {
        const {data}= await userAuth()
        setUser(data)
  } catch (err) {
    // console.error("Failed to fetch user profile:", err);
    setUser(null);
  }finally {
      setLoading(false)
    }
};
  useEffect(() => {
    fetchProfile();
}, []);
const loginUser = async (values) => {
    const repsonse = await login(values)
    if(repsonse.status !== 200) return repsonse
    if(repsonse.status === 200) {
        localStorage.removeItem('cart')
        fetchProfile()
        navigate('/', replace)
    }
}
const logoutUser = async () => {
    const repsonse = await logout()
    if(repsonse.status !== 200) return repsonse
    if(repsonse.status === 200) {
        fetchProfile()
        navigate('/', replace)
    }
};
return (
    <AuthContext.Provider value={{ user, setUser , loading , logoutUser, loginUser , BASEURL, fetchProfile}}>
      {children}
    </AuthContext.Provider>
  );
}
