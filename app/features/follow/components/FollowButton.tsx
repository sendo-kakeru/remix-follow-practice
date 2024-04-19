import { Button } from "@nextui-org/react";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useHover } from "~/hooks/useHover";

export default function FollowButton(props: {
  me: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      followings: Follow[];
      followers: Follow[];
    }
  > | null;
  user: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile | null;
      followings: Follow[];
      followers: Follow[];
    }
  >;
}) {
  const { isHover, handleMouseOver, handleMouseLeave } = useHover();
  const isFollow = props.me?.followings.some(
    (following) => following.followingId === props.user.id
  );
  return (
    <Form method={isFollow ? "delete" : "patch"} action={`/api/follow/${props.user.id}`}>
      <Button
        color={isFollow ? (isHover ? "danger" : "primary") : "primary"}
        radius="full"
        size="sm"
        type="submit"
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        variant={isFollow ? "bordered" : "solid"}
        className="font-bold px-8 w-fit @md:ml-auto"
      >
        フォロー
        {isFollow && (isHover ? "解除" : "中")}
      </Button>
    </Form>
  );
}
