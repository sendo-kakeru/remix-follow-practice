import { Authenticator } from "remix-auth";
import { authSessionStorage } from "~/features/auth/instances/auth.session-storage.server";
import { Profile, User } from "@prisma/client";
import { googleStrategy } from "./google-strategy.server";

const authenticator = new Authenticator<User & { profile: Profile | null }>(authSessionStorage);
authenticator.use(googleStrategy);
export const remixAuthenticator = authenticator;
