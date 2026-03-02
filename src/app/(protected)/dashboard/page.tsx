import { getCurrentUser } from "@/data/get-current-user";
import { getReservations } from "@/features/dashboard/actions";
import Content from "@/features/dashboard/components/content";
import { getRooms } from "@/features/settings/actions";
import { redirect } from "next/navigation";

export default async function Page() {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) redirect("/auth/login");

  const rooms = await getRooms();
  const reservations = await getReservations();

  return <Content rooms={rooms} reservations={reservations} />;
}
