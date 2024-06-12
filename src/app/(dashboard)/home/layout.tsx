import Container from "@/components/dashboard/container";

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