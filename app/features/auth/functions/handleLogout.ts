import { NavigateFunction } from "@remix-run/react";

export async function handleLogout(navigate: NavigateFunction) {
  await fetch(`${import.meta.env.VITE_APP_URL}/api/auth/logout`, {
    method: "POST",
  });
  navigate("/");
}
