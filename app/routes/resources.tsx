import type { MetaFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs, ActionFunctionArgs, redirect } from "@remix-run/node";
import { Link, useLoaderData, Form, useSubmit } from "@remix-run/react";
import { useState } from "react";

import { getResourceListItems, deleteResource } from "~/models/resource.server";
import { getUserId } from "~/session.server";

import NewResourcePage from "./resources.new";

export const meta: MetaFunction = () => [{ title: "Resources" }];
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const resourceListItems = await getResourceListItems({
    select: {
      id: true,
      url: true,
      title: true,
      description: true,
      ogTitle: true,
      ogDescription: true,
      ogImageUrl: true,
    },
  });
  return json({ resourceListItems, isLoggedIn: Boolean(userId) });
};

// Define the delete action
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id === "string") {
    await deleteResource({ id });
  }

  return redirect("/resources"); // Redirect to resources page after deletion
};

export default function ResourcePage() {
  const data = useLoaderData<typeof loader>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const submit = useSubmit();

  const handleShowForm = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsFormVisible((prev) => !prev);
  };

  const handleFormSuccess = async () => {
    setIsFormVisible(false);
    window.location.reload(); // Refresh page to show the updated resources list
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">Resources</h1>
        {data.isLoggedIn && (
          <Link
            to="#"
            onClick={handleShowForm}
            className="p-2 bg-blue-500 rounded text-white hover:bg-blue-600"
          >
            + New Resource
          </Link>
        )}
      </header>

      <main className="flex-1 p-6">
        {isFormVisible && (
          <div className="mb-8">
            <NewResourcePage onSuccess={handleFormSuccess} />
          </div>
        )}

        {data.resourceListItems.length === 0 ? (
          <p className="p-4 text-gray-700">No resources yet</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.resourceListItems.map((resource) => (
              <div
                key={resource.id}
                className="block rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-200"
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={resource.ogImageUrl || ""}
                      alt={resource.ogTitle || resource.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {resource.ogTitle || resource.title}
                    </h2>
                    <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                      {resource.ogDescription || resource.description}
                    </p>
                  </div>
                </a>
                {data.isLoggedIn && (
                  <Form method="post" onSubmit={(e) => submit(e.currentTarget)} className="p-4">
                    <input type="hidden" name="id" value={resource.id} />
                    <button
                      type="submit"
                      className="w-full py-2 mt-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:bg-blue-400"
                    >
                      Delete
                    </button>
                  </Form>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
