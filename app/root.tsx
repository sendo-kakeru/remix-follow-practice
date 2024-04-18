import { NextUIProvider } from "@nextui-org/react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from "@remix-run/react";
import stylesheet from "~/tailwind.css?url";

export function links() {
  return [{ rel: "stylesheet", href: stylesheet }];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <Outlet />
    </NextUIProvider>
  );
}
