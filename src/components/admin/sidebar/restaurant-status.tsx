import { BsDoorClosed } from "react-icons/bs";
import { RiDoorClosedLine } from "react-icons/ri";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GoIssueClosed } from "react-icons/go";

interface RestaurantStatusProps {
    status: boolean | null
}

const RestaurantStatus: React.FC<RestaurantStatusProps> = ({
    status
}) => {

    if (status === false) {
        return (
            <div className="flex  items-center gap-2 w-full p-2 bg-red-400 text-center text-white font-semibold">
                <IoMdCloseCircleOutline className="w-6 h-6 sm:w-6 sm:h-6 sm:ml-3"/>
                <span className="hidden sm:block">
                    Loja fechada
                </span>
            </div>
        )
    }
    return (
        <div>
            {status ? (
                <span>Loja aberta</span>
            ) : (
                <>
                    {status === false ? (
                        <span>Loja fechada</span>
                    ) : (
                        <span>Configure sua loja</span>
                    )}
                </>
            )}
        </div>
    )
}
 
export default RestaurantStatus;