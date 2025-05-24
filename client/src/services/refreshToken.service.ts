export const checkRefreshToken = async (): Promise<number | null> => {
  try {
    const res = await fetch('http://localhost:5000/seller/auth/check-refresh-token', {
      method: 'GET',
      credentials: 'include', 
    });
if (!res.ok) return null;
    const data = await res.json();
    console.log("client service refresh token: ",data);

    if (res.ok && data.success) {
      console.log('Valid refresh token:', data.data.userId);
      return data.data.userId;
    } else {
      console.warn('Invalid refresh token:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error checking refresh token:', error);
    return null;
  }
};
