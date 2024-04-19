import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { authGuard } from "~/features/auth/functions/guard.server";
import { authSessionStorage } from "~/features/auth/instances/auth.session-storage.server";
import { prisma } from "~/instances/prisma.server";

export async function action({ request, params }: ActionFunctionArgs) {
  const followingId = params.followingId;
  if (request.method === "PATCH") {
    if (!followingId) throw new Error("フォローするユーザーが見つかりません。");
    const me = await authGuard(request);
    await prisma.follow.create({
      data: {
        followerId: me.id,
        followingId,
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: me.id },
      include: { authenticators: true, profile: true, followers: true, followings: true },
    });
    const session = await authSessionStorage.getSession(request.headers.get("Cookie"));
    session.set("user", user);

    return redirect("/", {
      headers: {
        "Set-Cookie": await authSessionStorage.commitSession(session),
      },
    });
  } else if (request.method === "DELETE") {
    if (!followingId) throw new Error("フォロー解除するユーザーが見つかりません。");
    const me = await authGuard(request);
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: me.id,
          followingId,
        },
      },
    });
    const user = await prisma.user.findUnique({
      where: { id: me.id },
      include: { authenticators: true, profile: true, followers: true, followings: true },
    });
    const session = await authSessionStorage.getSession(request.headers.get("Cookie"));
    session.set("user", user);

    return redirect("/", {
      headers: {
        "Set-Cookie": await authSessionStorage.commitSession(session),
      },
    });
  }
}
