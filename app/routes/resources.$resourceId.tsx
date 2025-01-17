import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteResource, getResource } from "~/models/resource.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.resourceId, "resourceId not found");

  const resource = await getResource({ id: params.resourceId });
  if (!resource) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ resource });
};

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.resourceId, "resourceId not found");

  await deleteResource({ id: params.resourceId });

  return redirect("/resources");
};

export default function ResourceDetailsPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.resource.title}</h3>
      {data.resource.description && (
        <p className="py-6">{data.resource.description}</p>
      )}
      <p className="py-2">
        <a
          href={data.resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Visit Resource
        </a>
      </p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Resource not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
