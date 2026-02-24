import { getCurrentUser } from "@/data/get-current-user";
import { getRooms } from "@/features/dashboard/actions";
import Content from "@/features/dashboard/components/content";
import { getReservations } from "@/features/dashboard/reservation";
import { redirect } from "next/navigation";

export default async function Page() {
  const rooms = await getRooms();
  const reservations = await getReservations();
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) redirect("/auth/login");

  return <Content rooms={rooms} reservations={reservations} />;
}
