import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useLoaderData,
  Form,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import Draft from "draft-js";
import invariant from "tiny-invariant";

import { getArticle, deleteArticle } from "~/models/article.server";
import { getUserId } from "~/session.server";

const { Editor, EditorState, convertFromRaw } = Draft;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.articleId, "articleId not found");

  const userId = await getUserId(request); // Check if user is logged in
  const article = await getArticle({ id: params.articleId });

  if (!article) {
    throw new Response("Article not found", { status: 404 });
  }

  return json({ article, isLoggedIn: Boolean(userId) });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.articleId, "articleId not found");

  const userId = await getUserId(request);

  // Prevent deletion if user is not logged in
  if (!userId) {
    throw new Response("Unauthorized", { status: 401 });
  }

  await deleteArticle({ id: params.articleId });
  return redirect("/articles");
};

export default function ArticleDetailsPage() {
  const { article, isLoggedIn } = useLoaderData<typeof loader>();

  // Parse the Draft.js content state
  let editorState: Draft.EditorState | null = null;
  const rawContent = article.body; // Default fallback content

  try {
    const contentState = convertFromRaw(JSON.parse(article.body));
    editorState = EditorState.createWithContent(contentState);
  } catch (error) {
    console.warn(
      "Error parsing Draft.js content state. Falling back to raw content:",
      error
    );
  }

  const noop = () => {
    // Intentionally left empty to satisfy Draft.js' onChange requirement
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-bold">{article.title}</h1>

      {/* Display a preview image if available */}
      {article.previewImageUrl && (
        <img
          src={article.previewImageUrl}
          alt={article.title}
          className="mb-6 h-64 w-full rounded-lg object-cover"
        />
      )}

      {/* Display article category */}
      {article.category && (
        <p className="mb-4 text-sm text-gray-500">
          <strong>Category:</strong> {article.category}
        </p>
      )}

      {/* Render Draft.js editor content or fallback */}
      <div className="prose max-w-none text-gray-700">
        {editorState ? (
          <Editor editorState={editorState} readOnly={true} onChange={noop} />
        ) : (
          <p>{rawContent || "Content could not be loaded."}</p>
        )}
      </div>

      {/* Show delete button if user is logged in */}
      {isLoggedIn && (
        <Form method="post" className="mt-6">
          <button
            type="submit"
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:bg-red-400"
          >
            Delete Article
          </button>
        </Form>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="mx-auto max-w-4xl px-6 py-10">
          <h1 className="text-2xl font-bold text-red-500">Article not found</h1>
          <p className="mt-4">The requested article does not exist.</p>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p className="mt-4">{error.statusText}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold text-red-500">Unknown Error</h1>
    </div>
  );
}
