import Container from "@/components/admin/container";

interface HomePageProps {
    children: React.ReactNode;
}

const HomePage: React.FC<HomePageProps> = async ({
    children
}) => {
    return (
        <Container
            title="Início"
            description="Seja bem-vindo!"
        >
            {children}
        </Container>
    );
}
 
export default HomePage;