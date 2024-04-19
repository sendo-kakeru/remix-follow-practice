import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { httpStatus } from "~/configs/http-status";
import { hasProfile } from "~/features/user/functions/hasProfile";
import ProfileContent from "~/features/user/components/ProfileContent";
import ProfileTabs from "~/features/user/components/ProfileTabs";
import ProfileNavBar from "~/features/user/components/ProfileNavBar";
import { remixAuthenticator } from "~/features/auth/instances/authenticator.server";
import { prisma } from "~/instances/prisma.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const me = await remixAuthenticator.isAuthenticated(request);
  if (me && !hasProfile(me)) {
    throw json({ message: "ユーザーのプロフィールが存在しません。" }, httpStatus.NOT_FOUND);
  }
  // パスは @ + slug とする
  if (!params.userSlug?.startsWith("@")) {
    return redirect(`/@${params.userSlug}`);
  }
  const slug = params.userSlug.substring(1);
  const user = await prisma.user.findUnique({
    where: { slug },
    include: { authenticators: true, profile: true, followers: true, followings: true },
  });
  if (!user) {
    throw json({ message: "ユーザが存在しません。" }, httpStatus.NOT_FOUND);
  }
  if (!hasProfile(user)) {
    throw json({ message: "ユーザーのプロフィールが存在しません。" }, httpStatus.NOT_FOUND);
  }
  return json({ me, user });
}

export default function User() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <>
      <div className="flex flex-col w-full @container">
        <ProfileNavBar me={loaderData.me} user={loaderData.user} />
        <main className="flex flex-col max-w-[600px] w-full mx-auto px-4 @container">
          <ProfileContent me={loaderData.me} user={loaderData.user} />
          <ProfileTabs user={loaderData.user} />
        </main>
      </div>
    </>
  );
}
