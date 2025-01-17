import { Link } from "@remix-run/react";

export default function ArticleIndexPage() {
  return (
    <p>
      No article selected. Select an article on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new article.
      </Link>
    </p>
  );
}
