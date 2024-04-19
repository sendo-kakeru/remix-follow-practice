import { Button, Card, CardBody, Link, User } from "@nextui-org/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link as RemixLink, json, useLoaderData } from "@remix-run/react";
import { httpStatus } from "~/configs/http-status";
import { remixAuthenticator } from "~/features/auth/instances/authenticator.server";
import { hasProfile } from "~/features/user/functions/hasProfile";
import { useHover } from "~/hooks/useHover";
import { prisma } from "~/instances/prisma.server";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const users = await prisma.user.findMany({ include: { profile: true } });
  const me = await remixAuthenticator.isAuthenticated(request);
  if (me && !hasProfile(me)) {
    throw json({ message: "ユーザーのプロフィールが存在しません。" }, httpStatus.NOT_FOUND);
  }

  if (me && !hasProfile(me)) {
    throw json({ message: "ユーザーのプロフィールが存在しません。" }, httpStatus.NOT_FOUND);
  }
  return json({ me, users });
}
export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const { isHover, handleMouseOver, handleMouseLeave } = useHover();

  return (
    <div className="flex flex-col gap-2 p-12 w-[600px]">
      {loaderData.users.map((user) => (
        <Card to={`/${user.slug}`} isHoverable key={user.id} as={RemixLink}>
          <CardBody className="flex-row justify-between items-center">
            <div className="flex flex-col gap-2">
              <User
                name={user.profile?.name}
                description={`@${user.slug}`}
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
                  フォロワー<b>12</b>人
                </Link>
                <Link
                  href={`/@${user.slug}/following`}
                  color="foreground"
                  size="sm"
                  underline="hover"
                >
                  フォロー<b>8</b>人
                </Link>
              </div>
            </div>
            {loaderData.me?.id !== user.id && (
              <Button
                color={isHover ? "danger" : "primary"}
                radius="full"
                size="sm"
                type="submit"
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                variant={isHover ? "bordered" : "solid"}
                className="font-bold px-8 w-fit @md:ml-auto"
              >
                フォロー
                {isHover ? "解除" : "する"}
              </Button>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
