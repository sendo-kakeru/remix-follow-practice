import { Card, CardBody, Link, User } from "@nextui-org/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { httpStatus } from "~/configs/http-status";
import { remixAuthenticator } from "~/features/auth/instances/authenticator.server";
import FollowButton from "~/features/follow/components/FollowButton";
import { hasProfile } from "~/features/user/functions/hasProfile";
import { prisma } from "~/instances/prisma.server";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await prisma.user.findMany({
    include: { authenticators: true, profile: true, followers: true, followings: true },
  });
  const me = await remixAuthenticator.isAuthenticated(request);
  if (me && !hasProfile(me)) {
    throw json({ message: "ユーザーのプロフィールが存在しません。" }, httpStatus.NOT_FOUND);
  }
  return json({ me, users });
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col mx-auto gap-2 p-12 w-[600px]">
      {loaderData.users.map((user) => (
        <Card key={user.id}>
          <CardBody className="flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <User
                name={user.profile?.name}
                description={
                  <Link href={`/${user.slug}`} size="sm">
                    @{user.slug}
                  </Link>
                }
                avatarProps={{ src: user.profile?.image }}
                className="justify-start"
              />
              <div className="flex gap-4">
                <Link
                  href={`/@${user.slug}/followers`}
                  color="foreground"
                  size="sm"
                  underline="hover"
                >
                  フォロワー<b>{user.followers.length}</b>人
                </Link>
                <Link
                  href={`/@${user.slug}/following`}
                  color="foreground"
                  size="sm"
                  underline="hover"
                >
                  フォロー<b>{user.followings.length}</b>人
                </Link>
              </div>
            </div>
            {loaderData.me?.id !== user.id && <FollowButton me={loaderData.me} user={user} />}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
