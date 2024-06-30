import Container from "@/components/admin/container";
import Navbar from "./_components/navbar";

interface MenuLayoutProps {
    children: React.ReactNode;
}

const MenuLayout: React.FC<MenuLayoutProps> = async ({
    children
}) => {

    return (
        <Container
            title="Cardápio"
            description="Seu cardápio é a vitrine do seu restaurante. Personalize e organize seus pratos, categorias e itens adicionais de forma fácil e rápida. Mantenha tudo atualizado e destaque suas especialidades para atrair seus clientes!"
        >
            <Navbar />
            <div className="mt-4">
                {children}
            </div>
        </Container>
    );
}
 
export default MenuLayout;