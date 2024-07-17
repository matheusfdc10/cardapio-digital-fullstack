interface MenuLayoutProps {
    children: React.ReactNode;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({
    children
}) => {
    return (
        <>
            {children}
        </>
    );
}
 
export default MenuLayout;