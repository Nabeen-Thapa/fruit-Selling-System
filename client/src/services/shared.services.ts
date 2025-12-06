export async function clearSession() {
  const APIURL = import.meta.env.VITE_API_URL;

  try {
    const sessionClearRes = await fetch(`${APIURL}/user/logout`, {
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
