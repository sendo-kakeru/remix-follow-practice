import { Profile, User } from "@prisma/client";

export function hasProfile(
  user: User & { profile: Profile | null },
): user is User & { profile: Profile } {
  return user.profile !== null;
}
