export async function clearSession() {
  try {
    const sessionClearRes = await fetch('http://localhost:5000/user/logout', {
      method: 'GET',
      credentials: 'include', // sends cookies with the request
    });

    if (!sessionClearRes.ok) {
      console.error('Logout failed:', sessionClearRes.statusText);
    } else {
      console.log('Logout successful');
    }
  } catch (error) {
    console.error('Error while logging out:', error);
  }
}
