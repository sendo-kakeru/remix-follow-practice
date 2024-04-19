import { Badge, Listbox, ListboxItem } from "@nextui-org/react";
import SidebarUser from "./SidebarUser";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SidebarMenus(props: {
  me: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      followings: Follow[];
      followers: Follow[];
    }
  > | null;
}) {
  return (
    <>
      <div className="flex flex-col">
        {props.me ? (
          <>
            <Listbox
              aria-label="サイドメニュー"
              variant="flat"
              itemClasses={{
                title: "text-lg",
              }}
            >
              <ListboxItem key="debug" href="/debug" className="text-lg" textValue="search">
                デバッグ
              </ListboxItem>
            </Listbox>
          </>
        ) : (
          <Listbox
            aria-label="サイドメニュー"
            itemClasses={{
              title: "text-lg",
            }}
          >
            <ListboxItem
              key="notifications"
              href="/notifications"
              startContent={
                <Badge content="11" color="primary" size="sm">
                  <BellIcon className="w-6 h-6" />
                </Badge>
              }
              className="text-lg"
              textValue="お知らせ"
            >
              お知らせ
            </ListboxItem>
            <ListboxItem
              key="search"
              href="/search"
              startContent={<MagnifyingGlassIcon className="w-6 h-6" />}
              className="text-lg"
              textValue="search"
            >
              検索
            </ListboxItem>
          </Listbox>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <SidebarUser me={props.me} />
      </div>
    </>
  );
}
