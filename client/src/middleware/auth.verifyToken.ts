// src/components/VerifyUser.tsx
import { useEffect } from 'react';
import { checkRefreshToken } from '../services/refreshToken.service';
import { useNavigate } from 'react-router-dom';

const VerifyUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const userId = await checkRefreshToken();
      if (userId) {
        console.log('Logged in seller ID:', userId);
        // Proceed with page logic
      } else {
        console.log('Not authenticated');
       // navigate("/login"); // Redirect if not authenticated
      }
    };

    verifyToken();
  }, [navigate]);

  return null; // Or a loader
};

export default VerifyUser;
