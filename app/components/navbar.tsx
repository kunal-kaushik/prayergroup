import { Link, Form } from "@remix-run/react";

export function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <nav className="w-screen bg-gray-800 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="public/logo.png" // Replace this with the actual path to your logo image
            alt="Website Logo"
            className="h-10 w-auto object-contain" // Ensures the logo is well-sized and scales nicely
          />
          <span className="text-xl font-bold text-white">Flames of Love</span>
        </Link>

        {/* Navigation Links */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <li>
            <Link
              to="/"
              className="rounded-lg text-lg text-white transition-all duration-300 hover:rounded-lg hover:border hover:border-white hover:bg-transparent hover:px-2 hover:py-1"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/articles"
              className="rounded-lg text-lg text-white transition-all duration-300 hover:rounded-lg hover:border hover:border-white hover:bg-transparent hover:px-2 hover:py-1"
            >
              Articles
            </Link>
          </li>
          <li>
            <Link
              to="/resources"
              className="rounded-lg text-lg text-white transition-all duration-300 hover:rounded-lg hover:border hover:border-white hover:bg-transparent hover:px-2 hover:py-1"
            >
              Resources
            </Link>
          </li>
          <li>
            <Link
              to="/announcements"
              className="rounded-lg text-lg text-white transition-all duration-300 hover:rounded-lg hover:border hover:border-white hover:bg-transparent hover:px-2 hover:py-1"
            >
              Announcements
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="rounded-lg text-lg text-white transition-all duration-300 hover:rounded-lg hover:border hover:border-white hover:bg-transparent hover:px-2 hover:py-1"
            >
              About Us
            </Link>
          </li>
          {isLoggedIn ? (
            <li>
              <Form action="/logout" method="post" className="inline">
                <button
                  type="submit"
                  className="rounded bg-gray-700 px-3 py-1 text-lg text-white hover:bg-gray-600 focus:bg-gray-500"
                  style={{ fontSize: "1rem" }}
                >
                  Logout
                </button>
              </Form>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="rounded-lg text-lg text-white transition-all duration-300 hover:rounded-lg hover:border hover:border-white hover:bg-transparent hover:px-2 hover:py-1"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
