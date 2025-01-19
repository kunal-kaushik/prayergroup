import type { MetaFunction } from "@remix-run/node";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import Draft from "draft-js";
import { useState } from "react";

import NewArticleForm from "~/components/NewArticleForm";
import {
  getArticleListItems,
  createArticle,
  deleteArticle,
} from "~/models/article.server";
import type { ArticleListItem } from "~/models/article.server";
import { getUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "About Us" }];
const { convertFromRaw, Editor, EditorState } = Draft;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const articleListItems = await getArticleListItems();
  return json({ articleListItems, isLoggedIn: Boolean(userId) });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const actionType = formData.get("_action");

  if (actionType === "delete") {
    const articleId = formData.get("articleId");
    if (typeof articleId !== "string" || articleId.length === 0) {
      throw new Response("Article ID is required", { status: 400 });
    }

    await deleteArticle({ id: articleId });
    return redirect("/articles");
  }

  const title = formData.get("title");
  const body = formData.get("body");
  const category = formData.get("category");

  if (typeof title !== "string" || title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  if (typeof category !== "string" || category.length === 0) {
    return json(
      { errors: { category: "Category is required" } },
      { status: 400 },
    );
  }

  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  async function fetchRandomCatholicImage() {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=Roman+Catholic&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`,
      );

      if (!response.ok) {
        throw new Error(`Unsplash API responded with ${response.status}`);
      }

      const data = await response.json();

      if (data && data.urls && data.urls.regular) {
        return data.urls.regular; // Use the regular-sized image URL
      } else {
        console.error("Unexpected Unsplash API response format:", data);
        return "/default-image-path.jpg"; // Fallback image URL
      }
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
      return "/default-image-path.jpg"; // Fallback image URL in case of an error
    }
  }

  const randomImageUrl = await fetchRandomCatholicImage();

  await createArticle({
    title,
    body,
    category,
    previewImageUrl: randomImageUrl,
  });

  return redirect("/articles");
};

export default function ArticlePage() {
  const data = useLoaderData<typeof loader>();
  const groupedArticles: Record<string, ArticleListItem[]> =
    data.articleListItems.reduce(
      (acc: Record<string, ArticleListItem[]>, article: ArticleListItem) => {
        if (!acc[article.category]) {
          acc[article.category] = [];
        }
        acc[article.category].push(article);
        return acc;
      },
      {},
    );

  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [isReadMoreModalOpen, setIsReadMoreModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] =
    useState<ArticleListItem | null>(null);

  const handleReadMore = (article: ArticleListItem) => {
    setSelectedArticle(article);
    setIsReadMoreModalOpen(true);
  };

  const closeReadMoreModal = () => {
    setIsReadMoreModalOpen(false);
    setSelectedArticle(null);
  };

  const openNewArticleModal = () => {
    setIsNewArticleModalOpen(true);
  };

  const closeNewArticleModal = () => {
    setIsNewArticleModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl py-10">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        {data.isLoggedIn && (
          <button
            onClick={openNewArticleModal}
            className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            + New Article
          </button>
        )}
      </header>

      {/* Modal for New Article Form */}
      {isNewArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={closeNewArticleModal}
              className="absolute right-4 top-4 rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            >
              Close
            </button>
            <NewArticleForm onClose={closeNewArticleModal} />
          </div>
        </div>
      )}

      {/* Modal for Read More */}
      {isReadMoreModalOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative h-full w-full max-w-7xl overflow-auto rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={closeReadMoreModal}
              className="absolute right-4 top-4 rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            >
              Close
            </button>
            <h1 className="mb-4 text-3xl font-bold">{selectedArticle.title}</h1>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Category:</strong> {selectedArticle.category}
              </p>
            </div>
            <div>
              {(() => {
                try {
                  const contentState = convertFromRaw(
                    JSON.parse(selectedArticle.body),
                  );
                  const editorState =
                    EditorState.createWithContent(contentState);
                  return (
                    <div className="prose max-w-none text-gray-700">
                      <Editor
                        editorState={editorState}
                        readOnly
                        onChange={() => {}}
                      />
                    </div>
                  );
                } catch (error) {
                  return <p>{selectedArticle.body}</p>;
                }
              })()}
            </div>
          </div>
        </div>
      )}

      {Object.keys(groupedArticles).length === 0 ? (
        <p className="text-center text-lg">No articles yet</p>
      ) : (
        Object.entries(groupedArticles).map(([category, articles]) => (
          <section key={category} className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold">{category}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => {
                let articleBody = "";

                try {
                  const contentState = convertFromRaw(JSON.parse(article.body));
                  articleBody = contentState.getPlainText();
                } catch (error) {
                  articleBody = article.body;
                }

                return (
                  <div
                    key={article.id}
                    className="overflow-hidden rounded-lg border border-gray-200 shadow-md"
                  >
                    {article.previewImageUrl && (
                      <img
                        src={article.previewImageUrl}
                        alt={article.title}
                        className="h-48 w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="mb-2 text-lg font-bold">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {articleBody.slice(0, 100)}...
                      </p>
                      <button
                        onClick={() => handleReadMore(article)}
                        className="text-blue-500 hover:underline"
                      >
                        Read More →
                      </button>
                      {data.isLoggedIn && (
                        <Form method="post" className="mt-2">
                          <input type="hidden" name="_action" value="delete" />
                          <input
                            type="hidden"
                            name="articleId"
                            value={article.id}
                          />
                          <button
                            type="submit"
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </Form>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
