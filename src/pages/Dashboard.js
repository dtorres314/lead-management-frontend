import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAPI } from '../services/api';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutAPI()
            .then(() => {
                logout();
                navigate('/login');
            })
            .catch(error => {
                console.error('Logout failed', error);
            });
    };

    return (
        <div>
            <h1>Welcome, {user?.name}</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
