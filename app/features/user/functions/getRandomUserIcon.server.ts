const icons = [
  "candy.jpg",
  "chocolate.jpg",
  "ice.jpg",
  "pudding.jpg",
] as const satisfies readonly string[];

export function getRandomUserIcon() {
  const randomIndex = Math.floor(Math.random() * icons.length);
  return `https://r2.${import.meta.env.VITE_DOMAIN}/user/default-icons/${icons[randomIndex]}`;
}
getRandomUserIcon();
