import Image from "next/image";

interface LogoProps {
    src: string;
}

const Logo: React.FC<LogoProps> = ({
    src
}) => {
    return (
        <div className="h-14 sm:h-20 w-full relative">
            <Image
                alt="Logo"
                src={src}
                fill
                sizes="200"
                className="object-contain"
                // className={cn(
                //     "object-contain",
                //     isLoading && "scale-105 bg-slate-900 opacity-0 grayscale animate-pulse",
                // )}
            />
        </div>
    );
}
 
export default Logo;