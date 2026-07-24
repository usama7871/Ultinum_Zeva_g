import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getAuthenticatedAccount() {
  const { userId } = await auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  return db.user.upsert({
    where: { clerkId: userId },
    update: {
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? "Tasting Member",
    },
    create: {
      clerkId: userId,
      email,
      name: clerkUser.fullName ?? clerkUser.firstName ?? "Tasting Member",
    },
  });
}