import Container from "@/components/admin/container";
import Navbar from "./_components/navbar";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
    children
}) => {

    return (
        <Container
            title="Perfil"
            description="Seu perfil é seu resturante!"
        >
            <Navbar />
            <div className="mt-4 flex-1">
                {children}
            </div>
        </Container>
    );
}
 
export default ProfileLayout;