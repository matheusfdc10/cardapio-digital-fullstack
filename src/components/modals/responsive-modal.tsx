import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle,  } from "../ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    title?: string;
    onOpenChange: (open: boolean) => void;
    paddingNone?: boolean;
}

export const ResponsiveModal = ({
    children,
    open,
    title,
    onOpenChange,
    paddingNone,
}:ResponsiveModalProps) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className={cn(
                    "max-h-dvh",
                    paddingNone && "border-none",
                )}>
                    {title && (
                        <DrawerHeader>
                            <DrawerTitle>{title}</DrawerTitle>
                        </DrawerHeader>
                    )}
                    <DrawerFooter className={cn(
                        "overflow-x-auto",
                        paddingNone && "p-0",
                    )}>
                        {children}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(
                "max-h-[90dvh] overflow-x-auto",
                paddingNone && "p-0 border-none",
            )}>
                {title && (
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                )}
                {children}
            </DialogContent>
        </Dialog>
    )
}