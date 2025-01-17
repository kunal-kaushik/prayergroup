import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createResource } from "~/models/resource.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const url = formData.get("url");
  const description = formData.get("description");

  const errors: { title?: string; url?: string } = {};

  if (typeof title !== "string" || title.length === 0) {
    errors.title = "Title is required";
  }

  if (typeof url !== "string" || url.length === 0) {
    errors.url = "URL is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  await createResource({
    title: title as string,
    url: url as string,
    description: typeof description === "string" ? description : null
  });

  return json({ success: true }); // Return a success flag instead of redirect
};

interface NewResourcePageProps {
  onSuccess: () => void;
}

export default function NewResourcePage({ onSuccess }: NewResourcePageProps) {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Type narrowing to check if actionData has `errors` or `success`
    if (actionData && "errors" in actionData) {
      if (actionData.errors.title) {
        titleRef.current?.focus();
      } else if (actionData.errors.url) {
        urlRef.current?.focus();
      }
    } else if (actionData && "success" in actionData && actionData.success) {
      // Call onSuccess if submission was successful
      onSuccess();
    }
  }, [actionData, onSuccess]);

  return (
    <Form
      method="post"
      action="/resources/new"
      className="mx-auto flex max-w-md flex-col gap-4 rounded bg-white p-6 shadow-md"
    >
      <div>
        <label className="flex flex-col gap-1">
          <span>Title:</span>
          <input
            ref={titleRef}
            name="title"
            className="w-full rounded-md border-2 border-blue-500 px-3 text-lg"
            aria-invalid={actionData && "errors" in actionData && actionData.errors.title ? true : undefined}
            aria-errormessage={actionData && "errors" in actionData && actionData.errors.title ? "title-error" : undefined}
          />
        </label>
        {actionData && "errors" in actionData && actionData.errors.title && (
          <div className="pt-1 text-red-700" id="title-error">
            {actionData.errors.title}
          </div>
        )}
      </div>

      <div>
        <label className="flex flex-col gap-1">
          <span>URL:</span>
          <input
            ref={urlRef}
            name="url"
            className="w-full rounded-md border-2 border-blue-500 px-3 text-lg"
            aria-invalid={actionData && "errors" in actionData && actionData.errors.url ? true : undefined}
            aria-errormessage={actionData && "errors" in actionData && actionData.errors.url ? "url-error" : undefined}
          />
        </label>
        {actionData && "errors" in actionData && actionData.errors.url && (
          <div className="pt-1 text-red-700" id="url-error">
            {actionData.errors.url}
          </div>
        )}
      </div>

      <div>
        <label className="flex flex-col gap-1">
          <span>Description (optional):</span>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded-md border-2 border-blue-500 px-3 py-2 text-lg"
          />
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
