import React, { createContext, useState, useEffect } from 'react';
import { getAuthenticatedUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If token exists in localStorage, fetch the authenticated user
        const token = localStorage.getItem('token');
        if (token) {
            getAuthenticatedUser()
                .then(response => {
                    setUser(response.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');  // If fetch fails, clear token
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Login: store user data and token in state and localStorage
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    // Logout: clear user data and token from state and localStorage
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
