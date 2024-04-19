import { NextUIProvider } from "@nextui-org/react";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import stylesheet from "~/styles/tailwind.css?url";
import { remixAuthenticator } from "./features/auth/instances/authenticator.server";
import { hasProfile } from "./features/user/functions/hasProfile";
import { httpStatus } from "./configs/http-status";
import Sidebar from "./components/layouts/sidebar/Sidebar";

export function links() {
  return [
    { rel: "stylesheet", href: stylesheet },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    {
      href: "https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-10..0,100..900&display=swap",
      rel: "stylesheet",
    },
  ];
}

export async function loader({ request }: LoaderFunctionArgs) {
  const me = await remixAuthenticator.isAuthenticated(request);
  if (me && !hasProfile(me)) {
    throw json({ message: "ユーザーのプロフィールが存在しません。" }, httpStatus.NOT_FOUND);
  }
  return json({
    me,
  });
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
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  return (
    <NextUIProvider navigate={navigate}>
      <div className="flex">
        <Sidebar me={loaderData.me} />
        <Outlet />
      </div>
    </NextUIProvider>
  );
}
