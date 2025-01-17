import type { Announcement } from "@prisma/client";

import { prisma } from "~/db.server";
import { sendEmail } from "~/models/email.server";
import { getAllSubscribers } from "~/models/subscriber.server";


// Fetch a single announcement by its ID
export function getAnnouncement({ id }: Pick<Announcement, "id">) {
  return prisma.announcement.findUnique({
    where: { id },
  });
}

// Fetch a list of all announcements, ordered by date
export function getAnnouncementListItems() {
  return prisma.announcement.findMany({
    orderBy: { date: "desc" },
  });
}

export async function createAnnouncement({
  title,
  content,
  date,
}: {
  title: string;
  content: string;
  date: Date;
}) {
  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      date,
    },
  });

  // Send emails to all subscribers
  const subscribers = await getAllSubscribers();
  for (const email of subscribers) {
    await sendEmail({
      to: email,
      subject: `New Announcement: ${title}`,
      text: `${content}\n\nDate: ${date.toLocaleDateString()}`,
    });
  }

  return announcement;
}

// Delete an announcement by its ID
export function deleteAnnouncement({ id }: Pick<Announcement, "id">) {
  return prisma.announcement.delete({
    where: { id },
  });
}

export async function getLatestAnnouncement() {
  return prisma.announcement.findFirst({
    orderBy: { createdAt: "desc" }, // Ensures the latest announcement is fetched
  });
}
