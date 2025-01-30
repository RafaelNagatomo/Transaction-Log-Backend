import { Request } from "express"

export function getClientInfo(req: Request) {
  const forwarded = req.headers["x-forwarded-for"]
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded || req.socket.remoteAddress
  const clientIp = ip === "::1" ? "127.0.0.1" : ip

  return {
    clientIp: clientIp || "Unknown",
    userAgent: req.headers["user-agent"] || "Unknown"
  }
}
