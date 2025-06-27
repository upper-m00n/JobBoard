import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user,setUser]= useState(()=> 
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')): null
    )

    const login = (userData, token) => {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', token)
        setUser(userData)
    }

    const logout= () =>{
        localStorage.clear()
        setUser(null)
    }

    return (
    <AuthContext.Provider value={{user,login,logout}}>
        {children}
    </AuthContext.Provider>
)
}

export const useAuth =()=> useContext(AuthContext)


