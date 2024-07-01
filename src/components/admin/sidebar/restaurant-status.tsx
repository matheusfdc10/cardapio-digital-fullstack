import { IoMdCloseCircleOutline } from "react-icons/io";
import { MdCheckCircleOutline } from "react-icons/md";
import { HiOutlineExclamationCircle } from "react-icons/hi";


import Hint from "@/components/hint";

interface RestaurantStatusProps {
    status: boolean | null
}

const RestaurantStatus: React.FC<RestaurantStatusProps> = ({
    status
}) => {

    if (status === false) {
        return (
            <Hint
                label="Loja fechada"
                side="right"
                align="start"
                sideOffset={12}
            >
                <div className="flex items-center justify-center sm:justify-start gap-2 w-full p-2 bg-red-400 text-center text-white font-semibold">
                    <IoMdCloseCircleOutline className="w-6 h-6 sm:w-6 sm:h-6 sm:ml-3"/>
                    <span className="hidden sm:block">
                        Loja fechada
                    </span>
                </div>
            </Hint>
        )
    }

    if (status === true) {
        return (
            <Hint
                label="Loja aberta"
                side="right"
                align="start"
                sideOffset={12}
            >
                <div className="flex items-center justify-center sm:justify-start gap-2 w-full p-2 bg-emerald-400 text-center text-white font-semibold">
                    <MdCheckCircleOutline className="w-6 h-6 sm:w-6 sm:h-6 sm:ml-3"/>
                    <span className="hidden sm:block">
                        Loja aberta
                    </span>
                </div>
            </Hint>
        )
    }

    

    if (status === null) {
        return (
            <Hint
                label="Configure portal"
                side="right"
                align="start"
                sideOffset={12}
            >
                <div className="flex items-center justify-center sm:justify-start gap-2 w-full p-2 bg-amber-400 text-center text-white font-semibold">
                    <HiOutlineExclamationCircle className="w-6 h-6 sm:w-6 sm:h-6 sm:ml-3"/>
                    <span className="hidden sm:block">
                        Configure portal
                    </span>
                </div>
            </Hint>
        )
    }
}
 
export default RestaurantStatus;