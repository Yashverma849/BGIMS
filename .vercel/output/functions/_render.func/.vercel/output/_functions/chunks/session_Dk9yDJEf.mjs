import { unsealData, sealData } from 'iron-session';

const COOKIE = "mmbgims_session";
const TTL_SECONDS = 60 * 60 * 8;
const DEV_FALLBACK = "dev-only-insecure-secret-please-set-SESSION_SECRET-in-prod";
function secret() {
  const raw = process.env.SESSION_SECRET;
  if (!raw || raw.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to a 32+ char value in production");
    }
    if (!process.env._MMBGIMS_DEV_SECRET_WARNED) {
      console.warn(
        "[auth] SESSION_SECRET unset or <32 chars — using dev fallback. Do not deploy like this."
      );
      process.env._MMBGIMS_DEV_SECRET_WARNED = "1";
    }
    return DEV_FALLBACK;
  }
  return raw;
}
async function encodeSession(payload) {
  return sealData(payload, { password: secret(), ttl: TTL_SECONDS });
}
async function decodeSession(token) {
  if (!token) return null;
  try {
    const data = await unsealData(token, {
      password: secret(),
      ttl: TTL_SECONDS
    });
    if (!data || typeof data.userId !== "number") return null;
    return data;
  } catch {
    return null;
  }
}
async function setSessionCookie(cookies, payload) {
  const sealed = await encodeSession(payload);
  cookies.set(COOKIE, sealed, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS
  });
}
function clearSessionCookie(cookies) {
  cookies.delete(COOKIE, { path: "/" });
}
async function readSession(cookies) {
  const token = cookies.get(COOKIE)?.value;
  return decodeSession(token);
}

export { clearSessionCookie as c, readSession as r, setSessionCookie as s };
