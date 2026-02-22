import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { headers } from "next/headers";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) return null;

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: { id: true, name: true, email: true },
  });

  return user;
}
