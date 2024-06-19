interface MenuLayoutProps {
    children: React.ReactNode;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({
    children
}) => {
    return (
        <main>
            {children}
        </main>
    );
}
 
export default MenuLayout;