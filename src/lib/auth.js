import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "smm-panel-secret-change-in-production";

/**
 * Generate a JWT token for a user
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function getTokenFromHeaders(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
}

/**
 * Middleware-style auth check — returns decoded user or null
 */
export async function authenticate(request) {
  const token = getTokenFromHeaders(request);
  if (!token) return null;
  return verifyToken(token);
}
