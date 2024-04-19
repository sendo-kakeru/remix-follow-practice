import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftStartOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar, Button, Listbox, ListboxItem, ListboxSection, Tooltip } from "@nextui-org/react";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { Link, useNavigate } from "@remix-run/react";
import { ReactNode } from "react";
import { handleLogout } from "~/features/auth/functions/handleLogout";

export default function SidebarUser(props: {
  children?: ReactNode & JSX.Element[];
  me: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      followings: Follow[];
      followers: Follow[];
    }
  > | null;
}) {
  const navigate = useNavigate();
  return (
    <>
      {props.me ? (
        <>
          <Tooltip
            placement="right"
            content={
              <Listbox aria-label={`${props.me.profile.name}のプロフィールメニュー`} variant="flat">
                <ListboxSection showDivider>
                  <ListboxItem
                    href={`/${props.me.slug}`}
                    startContent={<UserIcon className="w-6 h-6" />}
                    key="profile"
                  >
                    プロフィール
                  </ListboxItem>
                </ListboxSection>
                <ListboxSection>
                  <ListboxItem
                    color="danger"
                    onPress={() => handleLogout(navigate)}
                    startContent={<ArrowLeftStartOnRectangleIcon className="w-6 h-6" />}
                    key="logout"
                    className="text-danger"
                  >
                    ログアウト
                  </ListboxItem>
                </ListboxSection>
              </Listbox>
            }
            key="user"
          >
            <Button
              variant="light"
              startContent={
                <Avatar src={props.me.profile.image} name={props.me.profile.name} size="sm" />
              }
              className="w-full justify-start p-2 text-lg gap-2"
            >
              {props.me.profile.name}
            </Button>
          </Tooltip>
        </>
      ) : (
        <Button
          to="/login"
          color="primary"
          startContent={<ArrowLeftEndOnRectangleIcon className="w-6 h-6" />}
          as={Link}
        >
          ログイン
        </Button>
      )}
    </>
  );
}
