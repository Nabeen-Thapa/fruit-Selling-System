// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { LoginForm } from '../../components/user/auth.loginForm';
import { loginUserType } from '../../types/user.types';

const BuyerLogin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
       <LoginForm userType={loginUserType.BUYER}/>
    </div>
  );
};

export default BuyerLogin;
