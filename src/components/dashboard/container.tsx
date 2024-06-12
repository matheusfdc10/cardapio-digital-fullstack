import { Separator } from "@/components/ui/separator";

interface ContainerProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    title,
    description,
    children
}) => {
    return (
        <div className="py-5 px-8 space-y-6">
            <div className="space-y-3">
                <h1 className="text-4xl font-bold">
                    {title}
                </h1>
                <p className="font-medium hidden sm:block text-muted-foreground">
                    {description}
                </p>
                <Separator />
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}
 
export default Container;