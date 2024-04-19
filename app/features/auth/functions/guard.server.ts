import { json } from "@remix-run/node";
import { httpStatus } from "~/configs/http-status";
import { remixAuthenticator } from "../instances/authenticator.server";

export async function authGuard(request: Request) {
  const me = await remixAuthenticator.isAuthenticated(request);
  if (!me) {
    throw json({ message: "ログインしてください。" }, httpStatus.FORBIDDEN);
  }
  return me;
}
