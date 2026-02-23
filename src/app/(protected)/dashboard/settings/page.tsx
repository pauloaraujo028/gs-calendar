import { getCurrentUser } from "@/data/get-current-user";
import { getRooms } from "@/features/dashboard/actions";
import Content from "@/features/settings/components/content";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/auth/login");

  const rooms = await getRooms();

  return <Content rooms={rooms} />;
};

export default SettingsPage;
