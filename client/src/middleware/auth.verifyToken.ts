import { useEffect } from 'react';
import { checkRefreshToken } from '../services/refreshToken.service';

const VerifyUser = () => {
  useEffect(() => {
    const verifyToken = async () => {
      const sellerId = await checkRefreshToken();
      if (sellerId) {
        console.log('Logged in seller ID:', sellerId);
        
      } else {
        console.log('Not authenticated');
        // Redirect to login
      }
    };

    verifyToken();
  }, []);

};

export default VerifyUser;
