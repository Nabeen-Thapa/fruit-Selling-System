// src/pages/LoginPage.tsx
import React, { useEffect } from 'react';
import { LoginForm } from "../../components/user/auth.loginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
