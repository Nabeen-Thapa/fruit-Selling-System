export const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false, // Set to true in production
    sameSite: "lax" as const,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
};