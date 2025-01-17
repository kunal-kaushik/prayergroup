import type { Article } from "@prisma/client";

import { prisma } from "~/db.server";

// Fetch a single article by ID
export function getArticle({ id }: { id: string }) {
  return prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      body: true, // Ensure serialized JSON body content is fetched
      category: true,
      previewImageUrl: true,
    },
  });
}

// Define the type for the article subset
export interface ArticleListItem {
  id: string;
  title: string;
  body: string;
  category: string;
  previewImageUrl: string;
}

// Fetch only the required fields for article list items
export function getArticleListItems(): Promise<ArticleListItem[]> {
  return prisma.article.findMany({
    select: {
      id: true,
      title: true,
      body: true,
      category: true,
      previewImageUrl: true,
    },
    orderBy: { updatedAt: "desc" },
  });
}

// Create a new article with category and preview image
export function createArticle({
  body,
  title,
  category,
  previewImageUrl,
}: Pick<Article, "body" | "title" | "category" | "previewImageUrl">) {
  // Validate inputs (additional safety)
  if (!body || !title || !category) {
    throw new Error("Invalid input: title, body, and category are required");
  }

  // Convert body to string if it's a JSON object (Draft.js serialized content)
  const serializedBody =
    typeof body === "string" ? body : JSON.stringify(body);

  return prisma.article.create({
    data: {
      title,
      body: serializedBody, // Store serialized JSON content
      category,
      previewImageUrl,
    },
  });
}

// Delete an article by its ID
export function deleteArticle({ id }: Pick<Article, "id">) {
  return prisma.article.delete({
    where: { id },
  });
}
