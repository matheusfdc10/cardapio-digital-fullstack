import Link from "next/link";
import { IoLocationSharp } from "react-icons/io5";

type Props = {
 
}
export const Footer = ({}: Props) => {
    return ( 
        <footer className="px-4 py-6 flex flex-col justify-center gap-2 items-center border-t">
            <p className="text-sm font-medium text-muted-foreground">
                Desenvolvido por:
            </p>
            <Link 
                target="_blank" 
                href="https://portfolio-matheusfdc.vercel.app/"
                className="font-semibold"
            >
                Matheus Freitas
            </Link>
            <span className="flex gap-1 text-sm font-medium text-muted-foreground">
                <IoLocationSharp className="w-5 h-5" />
                Rio de Janeiro - BR | ©2024
            </span>
        </footer>
    );
}