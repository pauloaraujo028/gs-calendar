import { getCurrentUser } from "@/data/get-current-user";
import { getRooms } from "@/features/settings/actions";
import Content from "@/features/settings/components/content";
import { getUsers } from "@/features/settings/user";
import { redirect } from "next/navigation";

const SettingsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) redirect("/auth/login");

  const [rooms, users] = await Promise.all([getRooms(), getUsers()]);

  return <Content rooms={rooms} users={users} />;
};

export default SettingsPage;
