export const checkRefreshToken = async (): Promise<number | null> => {
  try {
    const res = await fetch('http://localhost:5000/check-refresh-token', {
      method: 'GET',
      credentials: 'include', // send cookies
    });

    const data = await res.json();

    if (res.ok && data.success) {
      console.log('Valid refresh token:', data.data.sellerId);
      return data.data.sellerId;
    } else {
      console.warn('Invalid refresh token:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error checking refresh token:', error);
    return null;
  }
};
