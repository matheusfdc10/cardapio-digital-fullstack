import Container from "@/components/admin/container";

interface DeliveryAreaLayoutProps {
    children: React.ReactNode;
}

const DeliveryAreaLayout: React.FC<DeliveryAreaLayoutProps> = async ({
    children
}) => {

    return (
        <Container
            title="Área de entregas"
            description="Gerencie a distancia de suas entregas!"
        >
            <div>
                {children}
            </div>
        </Container>
    );
}
 
export default DeliveryAreaLayout;