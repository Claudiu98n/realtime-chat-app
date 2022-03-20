import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isLogin = localStorage.getItem("jwt");

    return isLogin ? children : <Navigate to="/" />;
};

export default PrivateRoute;
