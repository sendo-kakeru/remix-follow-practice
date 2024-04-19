import { Image } from "@nextui-org/react";
import { Link } from "@remix-run/react";
import SidebarMenus from "./SidebarMenus";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";

export default function Sidebar(props: {
  me: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      following: Follow[];
      followers: Follow[];
    }
  > | null;
}) {
  return (
    <div className="w-[224px] xl:w-[335px] hidden md:flex flex-shrink-0">
      <aside className="w-[224px] xl:w-[335px] fixed flex-col h-[100vh] flex pt-2 px-3 pb-5 border-r">
        <div className="flex flex-col pt-6 px-3 pb-4 mb-5">
          <Link to="/" color="foreground" className="w-24 flex gap-2 text-lg font-semibold">
            <Image
              src="/favicon.ico"
              alt="Okashibu"
              width={24}
              height={24}
              radius="none"
              classNames={{ wrapper: "flex flex-shrink-0 w-6 h-6" }}
            />
            okashibu
          </Link>
        </div>
        <div className="flex flex-col justify-between h-full">
          <SidebarMenus me={props.me} />
        </div>
      </aside>
    </div>
  );
}
