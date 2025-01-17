import { Form } from "@remix-run/react";
import Draft from "draft-js";
import { useState } from "react";
import "draft-js/dist/Draft.css";

const { Editor, EditorState, RichUtils, convertToRaw } = Draft;

interface NewArticleFormProps {
  onClose: () => void;
}

export default function NewArticleForm({ onClose }: NewArticleFormProps) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  ); // Initialize Draft.js editor state
  const categories = ["Prayers & Devotions", "Eucharistic", "Marian", "Other"];

  const handleKeyCommand = (command: string, editorState: Draft.EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Convert editor content to raw JSON and save it to the form
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    formData.set("body", JSON.stringify(rawContent));

    await fetch(event.currentTarget.action, {
      method: "POST",
      body: formData,
    });

    onClose(); // Close the modal on success
    window.location.reload();
  };

  return (
    <Form method="post" className="space-y-4" onSubmit={handleSubmit}>
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          className="w-full rounded border-gray-300 p-2"
        />
      </div>

      {/* Body Field (Draft.js Editor) */}
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-gray-700">
          Body
        </label>
        <div
          className="w-full h-64 border rounded p-2 overflow-y-scroll bg-white"
        >
          <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}
            onChange={setEditorState}
            placeholder="Write your article here..."
          />
        </div>
      </div>

      {/* Category Field */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          name="category"
          required
          className="w-full rounded border-gray-300 p-2"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
        >
          Cancel
        </button>
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
