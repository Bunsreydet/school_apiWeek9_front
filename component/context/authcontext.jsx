import React from 'react'
import { createContext, useState, useEffect } from 'react';
import { isAuthenticated, setToken as setAuthToken, logout as authLogout } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Function to check and update user state
    const checkAuthStatus = () => {
        const authenticatedUser = isAuthenticated();
        setUser(authenticatedUser);
        return authenticatedUser;
    };

    useEffect(() => {
        checkAuthStatus();
        setLoading(false);
    }, []);

    // Function to login user
    const login = (token) => {
        setAuthToken(token);
        const authenticatedUser = isAuthenticated();
        setUser(authenticatedUser);
    };

    // Function to logout user
    const logout = () => {
        authLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout, 
            checkAuthStatus 
        }}>
            {children}
        </AuthContext.Provider>
    );
};