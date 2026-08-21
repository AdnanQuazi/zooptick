import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminAuth, loginAdmin } from "../Api/api";

export const AdminAuthContext = createContext({});


export function AdminAuthContextProvider({ children }) { 
    const BASEURL = "https://zooptiq-zx3z.vercel.app"
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchProfile = async () => {
    try {
        const {data}= await adminAuth()
        setAdmin(data)
  } catch (err) {
    setAdmin(null);
  }finally {
      setLoading(false)
    }
};
  useEffect(() => {
    fetchProfile();
}, []);
const loginAdminC = async (values) => {
    const repsonse = await loginAdmin(values)
    if(repsonse.status !== 200) return repsonse
    if(repsonse.status === 200) {
        fetchProfile()
        navigate('/admin/dashboard')
    }
}

return (
    <AdminAuthContext.Provider value={{ admin, setAdmin , loading , loginAdminC ,fetchProfile}}>
      {children}
    </AdminAuthContext.Provider>
  );
}
