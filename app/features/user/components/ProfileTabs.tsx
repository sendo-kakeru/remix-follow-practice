import { Tab, Tabs } from "@nextui-org/react";
import { Authenticator, Follow, Profile, User } from "@prisma/client";
import { SerializeFrom } from "@remix-run/node";
import { useLocation } from "@remix-run/react";

const tabs = [
  { title: "投稿", path: "", key: "posts" },
  { title: "レシピ", path: "/recipes", key: "recipes" },
  { title: "いいね", path: "/likes", key: "likes" },
] as const;

export default function ProfileTabs(props: {
  user: SerializeFrom<
    User & {
      authenticators: Authenticator[];
      profile: Profile;
      following: Follow[];
      followers: Follow[];
    }
  >;
}) {
  const { pathname } = useLocation();
  const currentPathKey = pathname.split("/")[2];
  return (
    <Tabs
      aria-label="投稿一覧"
      variant="underlined"
      color="primary"
      fullWidth
      className="mb-4"
      selectedKey={currentPathKey ? currentPathKey : "posts"}
    >
      {tabs.map((tab) => (
        <Tab
          title={tab.title}
          id={`/${currentPathKey}`}
          href={
            currentPathKey === tab.path.split("/")[1]
              ? undefined
              : `/@${props.user.slug}${tab.path}`
          }
          key={tab.key}
        />
      ))}
    </Tabs>
  );
}
