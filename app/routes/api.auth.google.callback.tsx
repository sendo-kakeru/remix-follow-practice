import { LoaderFunctionArgs } from "@remix-run/node";
import { remixAuthenticator } from "~/features/auth/instances/authenticator.server";

export function loader({ request }: LoaderFunctionArgs) {
  return remixAuthenticator.authenticate("google", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    throwOnError: true,
  });
}
