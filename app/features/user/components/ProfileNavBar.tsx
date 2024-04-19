import {
  Button,
  Navbar,
  NavbarContent,
  NavbarItem,
  Tooltip,
  ListboxItem,
  Listbox,
} from "@nextui-org/react";
import { ArrowLeftIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "@remix-run/react";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { handleLogout } from "~/features/auth/functions/handleLogout";
import { useHover } from "~/hooks/useHover";
import { SerializeFrom } from "@remix-run/node";

export default function ProfileContent(props: {
  user: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      following: Follow[];
      followers: Follow[];
    }
  >;
  me: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      following: Follow[];
      followers: Follow[];
    }
  > | null;
}) {
  const navigate = useNavigate();
  const { isHover, handleMouseOver, handleMouseLeave } = useHover();

  return (
    <Navbar isBordered>
      <NavbarContent className="gap-0">
        <NavbarItem>
          <Button to={`/`} variant="light" radius="full" isIconOnly as={Link}>
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
        </NavbarItem>
        <NavbarItem className="ml-4">
          <Tooltip
            placement="bottom"
            content={
              <Listbox
                aria-label={`${props.user.profile.name}のプロフィールメニュー`}
                variant="flat"
              >
                <ListboxItem
                  startContent={<EnvelopeIcon className="w-6 h-6" />}
                  onPress={() => handleLogout(navigate)}
                  key="logout"
                >
                  ダイレクトメッセージ
                </ListboxItem>
              </Listbox>
            }
          >
            <Button variant="flat" size="sm">
              <span className="font-semibold">{props.user.profile.name}</span>
            </Button>
          </Tooltip>
        </NavbarItem>
        <NavbarItem className="ml-auto">
          {props.me?.id !== props.user.id &&
            (props.me ? (
              <Button
                color={isHover ? "danger" : "primary"}
                radius="full"
                size="sm"
                type="submit"
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
                variant={isHover ? "bordered" : "solid"}
                className="font-bold w-fit @sm:px-6 @md:ml-auto"
              >
                フォロー{isHover ? "解除" : "する"}
              </Button>
            ) : (
              <Button
                to="/login"
                color="primary"
                radius="full"
                size="sm"
                type="submit"
                className="font-bold w-fit @sm:px-6 @md:ml-auto"
                as={Link}
              >
                フォロー
              </Button>
            ))}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
