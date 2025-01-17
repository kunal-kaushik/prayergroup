import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import Draft, { EditorState as DraftEditorState } from "draft-js";
import "draft-js/dist/Draft.css"; // Import Draft.js styles
import { useState, useRef, useEffect } from "react";

import { createArticle } from "~/models/article.server";

const { Editor, EditorState, convertToRaw } = Draft;
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");
  const category = formData.get("category");

  if (typeof title !== "string" || title.trim().length === 0) {
    return json(
      { errors: { title: "Title is required", body: null, category: null } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    return json(
      { errors: { title: null, body: "Body is required", category: null } },
      { status: 400 }
    );
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    return json(
      { errors: { title: null, body: null, category: "Category is required" } },
      { status: 400 }
    );
  }

  // Generate a random Unsplash image URL
  const randomImageUrl = `https://source.unsplash.com/random/800x600?nature&sig=${Math.random()}`;

  await createArticle({
    title,
    body,
    category,
    previewImageUrl: randomImageUrl,
  });

  return redirect("/articles");
};

export default function NewArticlePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const categories = ["Prayers & Devotions", "Eucharistic", "Marian", "Other"];

  useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.category) {
      categoryRef.current?.focus();
    }
  }, [actionData]);

  const handleEditorChange = (state: DraftEditorState) => {
    setEditorState(state);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Convert Draft.js content to plain HTML
    const contentState = editorState.getCurrentContent();
    const rawContent = JSON.stringify(convertToRaw(contentState));
    formData.set("body", rawContent);

    await fetch(event.currentTarget.action, {
      method: "POST",
      body: formData,
    });

    window.location.href = "/articles"; // Redirect after successful submission
  };

  return (
    <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          ref={titleRef}
          id="title"
          name="title"
          className="w-full border rounded px-2 py-1"
        />
        {actionData?.errors?.title && (
          <div className="text-red-600">{actionData.errors.title}</div>
        )}
      </div>

      <div>
        <label htmlFor="body">Body:</label>
        <div className="w-full h-64 border rounded p-2">
          <Editor
            editorState={editorState}
            onChange={handleEditorChange}
            placeholder="Write your article here..."
          />
        </div>
        {actionData?.errors?.body && (
          <div className="text-red-600">{actionData.errors.body}</div>
        )}
      </div>

      <div>
        <label htmlFor="category">Category:</label>
        <select
          ref={categoryRef}
          id="category"
          name="category"
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {actionData?.errors?.category && (
          <div className="text-red-600">{actionData.errors.category}</div>
        )}
      </div>

      <div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Save
        </button>
      </div>
    </Form>
  );
}
