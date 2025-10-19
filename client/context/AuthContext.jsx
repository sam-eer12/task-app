import { createContext } from "react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useEffect } from "react";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const checkAuth = async ()=>{
        try {
            const {data} = await axios.get("/api/auth/check")
            if (data.success) {
                setAuthUser(data.user);
            }
        } catch (error) {
            // If token is invalid or expired, logout the user
            localStorage.removeItem("token");
            setToken(null);
            setAuthUser(null);
            axios.defaults.headers.common["token"] = null;
            console.log("Authentication failed:", error?.response?.data?.message || error.message);
        }
    }

    const login = async (state,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                
                setAuthUser(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Login failed");
        }
    }

    const logout = ()=>{
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("Logged out successfully");
       
    }

    useEffect(()=>{
        if(token){
            axios.defaults.headers.common["token"] = token;
            checkAuth();
        }
    },[])
    const value = {
        axios,
        authUser,
        onlineUsers,
        login,
        logout,
        
    }

    return <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
}