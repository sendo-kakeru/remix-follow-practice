import "~/styles/google-auth-button.css";
import { Form } from "@remix-run/react";
import GoogleAuthButton from "~/features/auth/components/GoogleAuthButton";

export default function Register() {
  return (
    <div className="relative h-[100svh] w-full flex flex-col justify-center items-center">
      <Form action="/api/auth/google" method="post" className="mb-8">
        <GoogleAuthButton type="submit">Googleで続ける</GoogleAuthButton>
      </Form>
    </div>
  );
}
