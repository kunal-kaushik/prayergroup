import type { MetaFunction } from "@remix-run/node";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getLatestAnnouncement } from "~/models/announcement.server";
import { getUserId } from "~/session.server";

export const meta: MetaFunction = () => [{ title: "Flames of Love" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  const latestAnnouncement = await getLatestAnnouncement();
  return json({ latestAnnouncement, isLoggedIn: Boolean(userId)});
};

export default function Index() {
  const { latestAnnouncement } = useLoaderData<typeof loader>();
  const data = useLoaderData<typeof loader>();

  return (
    <main className="relative bg-white sm:flex sm:items-center sm:justify-center">
      <div className="relative">
        <div className="mx-auto w-screen">
          <div className="relative shadow-xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <img
                className="h-full w-screen object-cover object-center"
                src="https://images.unsplash.com/photo-1601467699731-108a576df921?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="our lady of fatima"
              />
              <div className="absolute inset-0" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-yellow-500 drop-shadow-md">
                  Flames of Love
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-lg text-center text-5xl text-white sm:max-w-3xl">
                Rosary Prayer Group
              </p>
              <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {data.isLoggedIn ? (
                  <Link
                    to="/articles"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                  >
                    View Articles
                  </Link>
                ) : (
                  <div>
                    <Link
                      to="/subscribe"
                      className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-yellow-700 shadow-sm hover:bg-yellow-50 sm:px-8"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Latest Announcement Section */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Latest Announcement
              </h2>
              {latestAnnouncement ? (
                <div className="mt-4 text-xl text-gray-500">
                  <h3 className="font-bold">{latestAnnouncement.title}</h3>
                  <p>{latestAnnouncement.content}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(latestAnnouncement.date).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-xl text-gray-500">
                  No new announcements
                </p>
              )}
            </div>
          </div>
        </section>
        <section className="bg-white py-8">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Join Us
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                Every Thursday at 7PM
              </p>
            </div>
          </div>
        </section>
        <section className="bg-white py-4">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Location
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                Our Lady Queen of Peace R.C. Church, 209 US-206, Branchville, NJ
                07826
              </p>
            </div>
            <div className="py-6 text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Online Meeting Link
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-500">
                <a
                  href="https://meet.google.com/bzx-ctph-wqa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Google Meet
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}