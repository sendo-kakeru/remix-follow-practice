import { ActionFunctionArgs } from "@remix-run/node";
import { remixAuthenticator } from "~/features/auth/instances/authenticator.server";

export function action({ request }: ActionFunctionArgs) {
  return remixAuthenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    throwOnError: true,
  });
}
