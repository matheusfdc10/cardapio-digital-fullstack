import Container from "@/components/admin/container";

interface ProfileLayoutProps {
    children: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = async ({
    children
}) => {

    return (
        <Container
            title="Perfil"
            description="Seu perfil é seu resturante!"
        >
            <div className="mt-4">
                {children}
            </div>
        </Container>
    );
}
 
export default ProfileLayout;