import { Button, Image, Link } from "@nextui-org/react";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Link as RemixLink } from "@remix-run/react";
import { useHover } from "~/hooks/useHover";

export default function ProfileContent(props: {
  user: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      followings: Follow[];
      followers: Follow[];
    }
  >;
  me: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      followings: Follow[];
      followers: Follow[];
    }
  > | null;
}) {
  const { isHover, handleMouseOver, handleMouseLeave } = useHover();
  return (
    <div className="flex flex-col @md:flex-row justify-between mb-6 pt-12 md:pt-16 gap-2 @md:gap-8">
      <div className="flex flex-col items-center">
        <Image
          src={props.user.profile.image}
          width={96}
          height={96}
          radius="full"
          className="w-[96px] h-[96px] mb-2"
        />
        <div className="flex flex-col justify-between items-start mb-2">
          <p className="text-xl @lg:text-2xl font-semibold max-w-[240px]">
            {props.user.profile.name}
          </p>
          <p className="text-sm text-zinc-500">{`@${props.user.slug}`}</p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-col @md:flex-col-reverse items-center @md:items-end @lg:items-center gap-2 mb-10 mx-2">
          <div className="flex gap-4 @md:mr-auto">
            <Link
              href={`/@${props.user.slug}/followers`}
              color="foreground"
              size="sm"
              underline="hover"
            >
              フォロワー<b>12</b>人
            </Link>
            <Link
              href={`/@${props.user.slug}/following`}
              color="foreground"
              size="sm"
              underline="hover"
            >
              フォロー<b>8</b>人
            </Link>
          </div>
          {props.me?.id !== props.user.id ? (
            props.me ? (
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
            ) : (
              <Button
                to="/login"
                color="primary"
                radius="full"
                size="sm"
                type="submit"
                className="font-bold px-8 w-fit @md:ml-auto"
                as={RemixLink}
              >
                フォロー
              </Button>
            )
          ) : (
            <Button
              to="/settings/profile"
              radius="full"
              size="sm"
              type="submit"
              variant="bordered"
              className="font-bold px-4 w-fit @md:ml-auto"
              as={RemixLink}
            >
              プロフィールを編集
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
