export const isProd = process.env.NEXT_PUBLIC_CUSTOM_NODE_ENV === "prod";

// Base url
const API_BASE_URL = isProd
  ? "https://api.oncrowdr.com"
  // : "https://test-api.oncrowdr.com";
  : "http://localhost:3500";

// if you should ever change the jwt expiration time in the backedn also remember to change this
// this value should always be sligtly less than the jwt expiration time on the server
const COOKIE_EXPIRATION = 6.5 * 24 * 60 * 60; // 6 & half days in seconds

const COOKIE_CONFIG = {
  maxAge: COOKIE_EXPIRATION,
  path: "/", // Set the path to '/' to make it available for the entire domain
  secure: true,
  httpOnly: true
};
export { API_BASE_URL, COOKIE_CONFIG };
