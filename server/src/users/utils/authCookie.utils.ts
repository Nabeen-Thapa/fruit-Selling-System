import { Response } from "express";
import { AUTH_COOKIE_OPTIONS } from "../constants/cookie.constant";

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("access_token", accessToken, AUTH_COOKIE_OPTIONS);
    res.cookie("refresh_token", refreshToken, AUTH_COOKIE_OPTIONS);
}

//for logout
export function clearAuthCookies(res: Response): void {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
}