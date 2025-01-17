import { prisma } from "~/db.server";

// Add a new subscriber
export async function addSubscriber({ email }: { email: string }) {
  return prisma.subscriber.create({
    data: { email },
  });
}

// Check if an email already exists in the subscribers list
export async function findSubscriberByEmail({ email }: { email: string }) {
  return prisma.subscriber.findUnique({
    where: { email },
  });
}

// Fetch all subscriber emails
export async function getAllSubscribers() {
  const subscribers = await prisma.subscriber.findMany({
    select: { email: true },
  });
  return subscribers.map((subscriber) => subscriber.email);
}
