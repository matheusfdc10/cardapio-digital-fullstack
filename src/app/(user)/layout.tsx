interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
    children
}) => {
    return (
        <main>
            {children}
        </main>
    );
}
 
export default AdminLayout;