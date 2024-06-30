import { auth } from "@/auth";
import Sidebar from "@/components/admin/sidebar";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = async ({
    children
}) => {
    const session = await auth();

    if (session?.user.role !== UserRole.ADMIN) {
        redirect("/")
    }

    return (
        <main className="h-full">
            <Sidebar />
            <div className="pl-14 sm:pl-64 h-full overflow-y-auto">
                {children}
            </div>
        </main>
    );
}
 
export default DashboardLayout;