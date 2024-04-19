import { Button } from "@nextui-org/react";
import { useHover } from "~/hooks/useHover";

export default function FollowButton() {
  const { isHover, handleMouseOver, handleMouseLeave } = useHover();

  return (
    <Button
      color={isHover ? "danger" : "primary"}
      radius="full"
      size="sm"
      type="submit"
      onClick={(e) => e.preventDefault()}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      variant={isHover ? "bordered" : "solid"}
      className="font-bold px-8 w-fit @md:ml-auto"
    >
      フォロー
      {isHover ? "解除" : "する"}
    </Button>
  );
}
