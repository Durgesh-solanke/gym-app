import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminClient from "./AdminClient";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  return <AdminClient currentUserId={session!.user.id} />;
}
