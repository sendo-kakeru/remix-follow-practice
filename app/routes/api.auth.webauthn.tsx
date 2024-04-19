import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { remixAuthenticator } from "~/features/auth/instances/authenticator.server";
import { authSessionStorage } from "~/features/auth/instances/auth.session-storage.server";
import { webAuthnStrategy } from "~/features/auth/instances/webauthn-strategy.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const me = await remixAuthenticator.isAuthenticated(request);
  return webAuthnStrategy.generateOptions(request, authSessionStorage, me);
}

export function action({ request }: ActionFunctionArgs) {
  return remixAuthenticator.authenticate("webauthn", request, {
    successRedirect: "/",
    failureRedirect: "/login",
    throwOnError: true,
  });
}
