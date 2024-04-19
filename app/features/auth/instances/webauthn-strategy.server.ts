import { WebAuthnStrategy } from "remix-auth-webauthn/server";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { prisma } from "~/instances/prisma.server";
import { getRandomUserIcon } from "~/features/user/functions/getRandomUserIcon.server";

export const webAuthnStrategy = new WebAuthnStrategy<
  User & {
    authenticators: Authenticator[];
    profile: Profile | null;
    following: Follow[];
    followers: Follow[];
  }
>(
  {
    rpName: "Okashibu",
    rpID(request) {
      return new URL(request.url).hostname;
    },
    origin(request) {
      return new URL(request.url).origin;
    },
    // このユーザに関連付けられている認証子の一覧を返します。
    async getUserAuthenticators(me) {
      if (!me) return [];
      const authenticators = await prisma.authenticator.findMany({
        where: {
          userId: me.id,
        },
      });
      return authenticators.map((authenticator) => ({
        ...authenticator,
        transports: authenticator.transports.split(","),
      }));
    },
    // ユーザーオブジェクトをストラテジーが期待する形状に変換する。Transform the user object into the shape expected by the strategy.
    // 通常のユーザー名、ユーザーのメールアドレス、または他の何かを使用することができます。You can use a regular username, the users email address, or something else.
    getUserDetails(me) {
      if (me && me.email) {
        return {
          id: me.id,
          username: me.email,
          displayName: `displayName ${me.profile?.name}`,
        };
      }
      return null;
    },
    // データベースからユーザ名/メールアドレスでユーザを探します。Find a user in the database with their username/email.
    getUserByUsername(email) {
      return prisma.user.findUnique({
        where: { email },
        include: { authenticators: true, profile: true, followers: true, following: true },
      });
    },
    getAuthenticatorById(id) {
      return prisma.authenticator.findUnique({ where: { credentialID: id } });
    },
  },
  async function verify({ authenticator, type, username }) {
    if (typeof username !== "string") throw new Error("emailが文字列ではありません");
    let me:
      | (User & {
          authenticators: Authenticator[];
          profile: Profile | null;
          following: Follow[];
          followers: Follow[];
        })
      | null = null;
    const savedAuthenticator = await prisma.authenticator.findUnique({
      where: { credentialID: authenticator.credentialID },
    });
    if (type === "registration") {
      if (savedAuthenticator) {
        throw new Error("この認証機器は既に登録されています。");
      }
      me = await prisma.user.findUnique({
        where: { email: username },
        include: { authenticators: true, profile: true, followers: true, following: true },
      });

      if (me) throw new Error("このメールアドレスは既に使用されています。");

      me = await prisma.user.create({
        data: {
          slug: username.split("@")[0],
          email: username,
          authenticators: {
            create: {
              ...authenticator,
            },
          },
          profile: {
            create: {
              name: username.split("@")[0],
              image: getRandomUserIcon(),
            },
          },
        },
        include: { authenticators: true, profile: true, followers: true, following: true },
      });
    } else if (type === "authentication") {
      // ユーザー認証時
      if (!savedAuthenticator) throw new Error("認証機器が見つかりません。");
      me = await prisma.user.findUnique({
        where: { id: savedAuthenticator.userId },
        include: { authenticators: true, profile: true, followers: true, following: true },
      });
    }

    if (!me) throw new Error("ユーザーが存在しません。");
    return me;
  }
);
