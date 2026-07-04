import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <AdminShell user={session?.user}>
      {children}
    </AdminShell>
  );
}
