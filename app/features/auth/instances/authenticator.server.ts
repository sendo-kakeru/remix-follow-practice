import { Authenticator } from "remix-auth";
import { authSessionStorage } from "~/features/auth/instances/auth.session-storage.server";
import { Authenticator as AuthenticatorType, Follow, Profile, User } from "@prisma/client";
import { googleStrategy } from "./google-strategy.server";
import { webAuthnStrategy } from "./webauthn-strategy.server";

const authenticator = new Authenticator<
  User & {
    authenticators: AuthenticatorType[];
    profile: Profile | null;
    followings: Follow[];
    followers: Follow[];
  }
>(authSessionStorage);
authenticator.use(webAuthnStrategy);
authenticator.use(googleStrategy);
export const remixAuthenticator = authenticator;
