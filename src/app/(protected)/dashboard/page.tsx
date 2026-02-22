import { getCurrentUser } from "@/data/get-current-user";
import { redirect } from "next/navigation";

export default async function Home() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) redirect("/auth/login");

  return (
    <div>
      <h1></h1>
    </div>
  );
}
