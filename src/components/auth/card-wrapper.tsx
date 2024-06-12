"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerTitle: string;
    headerDescription?: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
    backButtonHref,
    headerTitle,
    backButtonLabel,
    children,
    headerDescription,
    showSocial
}) => {
    return ( 
        <Card className="w-[400px] bg-zinc-50">
            <CardHeader>
                <Header title={headerTitle} description={headerDescription} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter>
                <BackButton
                    label={backButtonLabel}
                    href={backButtonHref}
                />
            </CardFooter>
        </Card>
     );
}