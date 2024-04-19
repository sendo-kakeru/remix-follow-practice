import "~/styles/google-auth-button.css";
import { Form } from "@remix-run/react";
import GoogleAuthButton from "~/features/auth/components/GoogleAuthButton";
import { Button, Divider, Image, Input, Link } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { WebAuthnOptionsResponse } from "remix-auth-webauthn";
import { nanoid, startRegistration } from "remix-auth-webauthn/browser";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setErrorMessage("");
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const email = formData.get("username");
    if (typeof email !== "string") throw new Error("emailが文字列ではありません");
    const response = await fetch(
      `${import.meta.env.VITE_APP_URL}/api/auth/webauthn?username=${email}`
    );
    if (!response.ok) {
      throw response;
    }
    const options: WebAuthnOptionsResponse & {
      extra: unknown;
    } = await response.json();

    const responseValue = JSON.stringify(
      await startRegistration({
        challenge: options.challenge,
        excludeCredentials: options.authenticators,
        rp: options.rp,
        user: {
          id: nanoid(),
          name: email.split("@")[0],
          displayName: email.split("@")[0],
        },
        pubKeyCredParams: [
          {
            alg: -7,
            type: "public-key",
          },
          {
            alg: -257,
            type: "public-key",
          },
        ],
        timeout: 90 * 1000,
        attestation: "none",
        authenticatorSelection: {
          residentKey: "discouraged",
          requireResidentKey: false,
        },
        extensions: { credProps: true },
      })
    );

    const responseEl = Object.assign(document.createElement("input"), {
      type: "hidden",
      name: "response",
      value: responseValue,
    });
    formElement.prepend(responseEl);
    const typeEl = Object.assign(document.createElement("input"), {
      type: "hidden",
      name: "type",
      value: "registration",
    });
    formElement.prepend(typeEl);
    formElement.submit();
  }
  return (
    <div className="relative h-[100svh] w-full flex flex-col justify-center items-center">
      <div className="w-full max-w-[360px] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4 mb-12">
          <Image src="/favicon.ico" alt="sign in" width={40} height={40} radius="none" />
          <h1 className="font-semibold text-lg">Okashibu</h1>
        </div>
        <Form
          action="/api/auth/webauthn"
          method="post"
          onSubmit={handleSubmit}
          className="w-full flex flex-col justify-center gap-4"
        >
          <Input
            label="メールアドレス"
            type="text"
            name="username"
            variant="bordered"
            startContent={<EnvelopeIcon className="w-6 h-6 text-zinc-400" />}
            isInvalid={!!errorMessage}
            errorMessage={errorMessage}
          />
          <Button type="submit" color="primary" radius="full">
            登録する
          </Button>
        </Form>
        <Divider className="my-8" />
        <Form action="/api/auth/google" method="post" className="mb-8">
          <GoogleAuthButton type="submit">Googleで続ける</GoogleAuthButton>
        </Form>
        <div className="w-full flex justify-end">
          <Link href="/login" color="foreground" size="sm" underline="always">
            ログインする
          </Link>
        </div>
      </div>
      <p className="absolute bottom-5 sm:bottom-[40px] text-xs text-zinc-400">
        登録することで、Okashibuの利用規約、プライバシーポリシー、Cookieポリシーに同意するものとします。
      </p>
    </div>
  );
}
