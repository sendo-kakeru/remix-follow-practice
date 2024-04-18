import { json } from "@remix-run/node";
import { httpStatus } from "~/configs/http-status";
import { flashSessionStorage } from "~/features/flash-message/instances/flash.session-storage.server";
import { remixAuthenticator } from "../instances/authenticator.server";

export async function authGuard(request: Request) {
  const me = await remixAuthenticator.isAuthenticated(request);
  if (!me) {
    const flashSession = await flashSessionStorage.getSession(request.headers.get("Cookie"));
    flashSession.flash("flashMessage", {
      state: "failed",
      message: "ログインしてください。",
    });
    throw json(
      { message: "ログインしてください。" },
      {
        ...httpStatus.FORBIDDEN,
        headers: {
          "Set-Cookie": await flashSessionStorage.commitSession(flashSession),
        },
      },
    );
  }
  return me;
}
