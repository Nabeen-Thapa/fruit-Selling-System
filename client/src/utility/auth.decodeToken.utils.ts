import { jwtDecode } from "jwt-decode";

interface tokenPayload{
    userId: string;
    email: string;
    role: "seller" | "buyer" | string;
    [key:string]:unknown;
}

export const getCookieToken = (): string | null => {
  const match = document.cookie.match(/(?:^|; )refresh_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
};


export const getDecodedToken = (): tokenPayload | null =>{
    const token = getCookieToken();
    if(!token) return null;

    try {
    return jwtDecode<tokenPayload>(token);
    } catch (error) {
        console.error("Invalid JWT:", error.message);
    return null;
    }
}