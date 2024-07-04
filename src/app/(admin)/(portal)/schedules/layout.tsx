import Container from "@/components/admin/container";

interface SchedulesLayoutProps {
    children: React.ReactNode;
}

const SchedulesLayout: React.FC<SchedulesLayoutProps> = async ({
    children
}) => {

    return (
        <Container
            title="Horários"
            description="Gerencie seu horário de funcionamento!"
        >
            <div className="">
                {children}
            </div>
        </Container>
    );
}
 
export default SchedulesLayout;