import type { Resource, Prisma } from "@prisma/client";

import { prisma } from "~/db.server";
import { fetchOpenGraphData } from "~/utils/og-fetcher"; // Import the Open Graph fetcher function

// Fetch a single resource by its ID
export function getResource({ id }: Pick<Resource, "id">) {
  return prisma.resource.findFirst({
    select: { id: true, title: true, url: true, description: true, ogTitle: true, ogDescription: true, ogImageUrl: true },
    where: { id },
  });
}

// Fetch a list of all resources (without user restriction)
export function getResourceListItems(options: Prisma.ResourceFindManyArgs = {}) {
  return prisma.resource.findMany({
    // Spread options so select, where, or other args can be passed in
    ...options,
    // Default ordering by updatedAt if no specific order is provided
    orderBy: options.orderBy || { updatedAt: "desc" },
  });
}

// Create a new resource, including Open Graph data fetching
export async function createResource({
  title,
  url,
  description,
}: Pick<Resource, "title" | "url" | "description">) {
  // Fetch Open Graph data for the URL
  const ogData = await fetchOpenGraphData(url);

  // Save the resource with Open Graph metadata in the database
  return prisma.resource.create({
    data: {
      title,
      url,
      description,
      ogTitle: ogData.ogTitle,
      ogDescription: ogData.ogDescription,
      ogImageUrl: ogData.ogImageUrl,
    },
  });
}

// Delete a resource by its ID
export function deleteResource({ id }: Pick<Resource, "id">) {
  return prisma.resource.delete({
    where: { id },
  });
}
