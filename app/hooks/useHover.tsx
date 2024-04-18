import { useState } from "react";

export function useHover() {
  const [isHover, setIsHover] = useState(false);
  function handleMouseOver() {
    setIsHover(true);
  }
  function handleMouseLeave() {
    setIsHover(false);
  }

  return { isHover, setIsHover, handleMouseOver, handleMouseLeave };
}
