import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "./AdminShell";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <AdminShell user={session.user}>
      {children}
    </AdminShell>
  );
}
