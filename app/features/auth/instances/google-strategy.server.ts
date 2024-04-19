import { GoogleStrategy } from "remix-auth-google";
import { prisma } from "../../../instances/prisma.server";
import { Authenticator, Follow, Profile, User } from "@prisma/client";

export const googleStrategy = new GoogleStrategy<
  User & {
    authenticators: Authenticator[];
    profile: Profile | null;
    followings: Follow[];
    followers: Follow[];
  }
>(
  {
    clientID: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
  },
  async ({ profile }) => {
    const me = await prisma.user.findUnique({
      where: {
        id: profile.id,
      },
      include: {
        authenticators: true,
        profile: true,
        followers: true,
        followings: true,
      },
    });
    if (me) {
      return me;
    } else {
      return prisma.user.create({
        data: {
          id: profile.id,
          slug: profile.emails[0].value.split("@")[0],
          email: profile.emails[0].value,
          profile: {
            create: {
              name: profile.displayName,
              image: profile.photos[0].value,
            },
          },
        },
        include: {
          authenticators: true,
          profile: true,
          followers: true,
          followings: true,
        },
      });
    }
  }
);
