import { json, LoaderFunctionArgs, ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, Form, useSubmit } from "@remix-run/react";
import { useState } from "react";

import { getAnnouncementListItems, deleteAnnouncement } from "~/models/announcement.server";
import { getUserId } from "~/session.server";

import NewAnnouncementForm from "./announcements.new";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const announcements = await getAnnouncementListItems();
  return json({ announcements, isLoggedIn: Boolean(userId) });
};

// Action function for deleting announcements
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const id = formData.get("id");

  if (typeof id === "string") {
    await deleteAnnouncement({ id });
  }

  return redirect("/announcements");
};

export default function AnnouncementsPage() {
  const data = useLoaderData<typeof loader>();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const submit = useSubmit();

  const toggleFormVisibility = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsFormVisible((prev) => !prev);
  };

  const handleFormSuccess = () => {
    setIsFormVisible(false); // Hide the form after successful submission
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-gray-100">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">Announcements</h1>
        {data.isLoggedIn && (
          <button
            onClick={toggleFormVisibility} // Toggle form without navigation
            className="p-2 bg-blue-500 rounded text-white hover:bg-blue-600"
          >
            + New Announcement
          </button>
        )}
      </header>

      <main className="flex-1 p-6">
        {isFormVisible && (
          <div className="mb-8">
            <NewAnnouncementForm onSuccess={handleFormSuccess} />
          </div>
        )}

        {data.announcements.length === 0 ? (
          <p className="p-4 text-gray-700">No announcements yet</p>
        ) : (
          <div className="space-y-4">
            {data.announcements.map((announcement) => (
              <div key={announcement.id} className="block rounded shadow-lg bg-white p-4">
                <h2 className="text-lg font-semibold text-gray-800">{announcement.title}</h2>
                <p className="mt-2 text-gray-600">{announcement.content}</p>
                <p className="mt-2 text-sm text-gray-500">
                  Date: {new Date(announcement.date).toLocaleDateString()}
                </p>
                {data.isLoggedIn && (
                  <Form
                    method="post"
                    onSubmit={(e) => submit(e.currentTarget)}
                    className="mt-4"
                  >
                    <input type="hidden" name="id" value={announcement.id} />
                    <button
                      type="submit"
                      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:bg-blue-400"
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