import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PendingClient from "./PendingClient";

export default async function PendingPage() {
  const session = await getServerSession(authOptions);
  const userName =
    session?.user?.name || session?.user?.email || "there";
  return <PendingClient userName={userName} />;
}
