import { ActionFunctionArgs, redirect, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useRef, useEffect } from "react";

import { createAnnouncement } from "~/models/announcement.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const date = formData.get("date");

  const errors = {
    title: typeof title !== "string" || title.length === 0 ? "Title is required" : undefined,
    content: typeof content !== "string" || content.length === 0 ? "Content is required" : undefined,
    date: !date ? "Date is required" : undefined,
  };

  if (errors.title || errors.content || errors.date) {
    return json({ error: errors }, { status: 400 });
  }

  await createAnnouncement({
    title: title as string,
    content: content as string,
    date: new Date(date as string),
  });
  
  // Redirect to announcements page after successful submission
  return redirect("/announcements");
};

interface NewAnnouncementFormProps {
  onSuccess: () => void;
}

export default function NewAnnouncementForm({ onSuccess }: NewAnnouncementFormProps) {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData && "error" in actionData) {
      if (actionData.error.title) titleRef.current?.focus();
      else if (actionData.error.content) contentRef.current?.focus();
      else if (actionData.error.date) dateRef.current?.focus();
    } else if (actionData && "success" in actionData) {
      onSuccess();
    }
  }, [actionData, onSuccess]);

  return (
    <Form method="post" action="/announcements/new" className="bg-white p-6 rounded shadow-md space-y-4">
      <div>
        <label>
          <span>Title:</span>
          <input
            ref={titleRef}
            name="title"
            className="w-full rounded border-2 p-2"
            aria-invalid={Boolean(actionData && "error" in actionData && actionData.error.title)}
            aria-errormessage={
              actionData && "error" in actionData && actionData.error.title ? "title-error" : undefined
            }
          />
        </label>
        {actionData && "error" in actionData && actionData.error.title && (
          <p className="text-red-600" id="title-error">
            {actionData.error.title}
          </p>
        )}
      </div>

      <div>
        <label>
          <span>Content:</span>
          <textarea
            ref={contentRef}
            name="content"
            rows={4}
            className="w-full rounded border-2 p-2"
            aria-invalid={Boolean(actionData && "error" in actionData && actionData.error.content)}
            aria-errormessage={
              actionData && "error" in actionData && actionData.error.content
                ? "content-error"
                : undefined
            }
          />
        </label>
        {actionData && "error" in actionData && actionData.error.content && (
          <p className="text-red-600" id="content-error">
            {actionData.error.content}
          </p>
        )}
      </div>

      <div>
        <label className="flex flex-col gap-1">
          <span>Date:</span>
          <input
            type="date"
            ref={dateRef}
            name="date"
            className="w-48 rounded border-2 p-1 text-sm"
            aria-invalid={Boolean(actionData && "error" in actionData && actionData.error.date)}
            aria-errormessage={
              actionData && "error" in actionData && actionData.error.date ? "date-error" : undefined
            }
          />
        </label>
        {actionData && "error" in actionData && actionData.error.date && (
          <p className="text-red-600 text-sm mt-1" id="date-error">
            {actionData.error.date}
          </p>
        )}
      </div>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Save
      </button>
    </Form>
  );
}
