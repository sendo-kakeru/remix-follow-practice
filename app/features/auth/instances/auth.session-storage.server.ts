import { createCookie, createFileSessionStorage, json } from "@remix-run/node";
import { httpStatus } from "~/configs/http-status";
import { createUpstashSessionStorage } from "./upstash.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw json({ message: "SESSION_SECRETが設定されていません。" }, httpStatus.UNAUTHORIZED);
}

const EXPIRATION_DURATION_IN_SECONDS = 60 * 60 * 24 * 2;

const expires = new Date();
expires.setSeconds(expires.getSeconds() + EXPIRATION_DURATION_IN_SECONDS);

const sessionCookie = createCookie("auth_session", {
  secrets: [sessionSecret],
  sameSite: "lax",
  expires,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
});

export const authSessionStorage =
  process.env.NODE_ENV === "production"
    ? createUpstashSessionStorage({
        cookie: sessionCookie,
      })
    : createFileSessionStorage({ cookie: sessionCookie, dir: "./sessions" });
