export interface tokenPayload {
  userId: string;
  email: string;
  role: "seller" | "buyer" | string;
  [key: string]: unknown;
}

export async function fetchCurrentUser(): Promise<tokenPayload | null> {
  const APIURL = import.meta.env.VITE_API_URL;
    try {
    const res = await fetch(`${APIURL}/seller/auth/me`, {
      method: "GET",
      credentials: "include", 
    });

    if (!res.ok) {
      console.warn("Not authenticated");
      return null;
    }

    const data = await res.json();
    return data.data; 
  } catch (err) {
    console.error("Failed to fetch current user:", err);
    return null;
  }
}
