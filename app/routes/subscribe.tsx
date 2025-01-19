import type { MetaFunction } from "@remix-run/node";
import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useRef, useState, useEffect } from "react";

import { addSubscriber, findSubscriberByEmail } from "~/models/subscriber.server";

export const meta: MetaFunction = () => [{ title: "About Us" }];

// Define the structure of actionData
type ActionData =
  | { error: string }
  | { success: boolean };

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (typeof email !== "string" || email.length === 0) {
    return json({ error: "Email is required" }, { status: 400 });
  }

  const existingSubscriber = await findSubscriberByEmail({ email });
  if (existingSubscriber) {
    return json({ error: "You are already subscribed." }, { status: 400 });
  }

  await addSubscriber({ email });
  return json({ success: true });
};

export default function Subscribe() {
  const actionData = useActionData<ActionData>();
  const transition = useNavigation();
  const emailRef = useRef<HTMLInputElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (actionData && "error" in actionData) {
      emailRef.current?.focus();
      setIsSuccess(false);
    } else if (actionData && "success" in actionData) {
      setIsSuccess(true);
    }
  }, [actionData]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-semibold mb-4">Subscribe for Updates</h1>
      <Form method="post" className="space-y-4">
        <label className="block">
          <span className="text-gray-700">Email:</span>
          <input
            ref={emailRef}
            type="email"
            name="email"
            required
            className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
              actionData && "error" in actionData
                ? "border-red-500"
                : isSuccess
                ? "border-green-500"
                : "border-gray-300"
            }`}
            aria-invalid={Boolean(actionData && "error" in actionData)}
            aria-errormessage={
              actionData && "error" in actionData ? "email-error" : undefined
            }
          />
        </label>
        {actionData && "error" in actionData && (
          <p id="email-error" className="text-red-500 text-sm">
            {actionData.error}
          </p>
        )}
        {isSuccess && (
          <p className="text-green-500 text-sm">Thank you for subscribing!</p>
        )}
        <button
          type="submit"
          disabled={transition.state === "submitting"}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {transition.state === "submitting" ? "Submitting..." : "Subscribe"}
        </button>
      </Form>
    </div>
  );
}
