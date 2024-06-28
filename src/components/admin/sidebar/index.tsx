import List from "./list";
import SignOutButton from "./signout-button";

const Sidebar = () => {
    return (
        <aside className="fixed z-[1] left-0 h-full w-14 sm:w-64 flex py-3 flex-col gap-y-4 bg-zinc-100 overflow-y-auto">
            <div className="flex justify-center items-center h-14 px-3">
                <h1>Logo</h1>
            </div>
            <div className="px-3">
                Loja fechada
            </div>
            <div className="flex-1 flex flex-col justify-between">
                <List />
                <SignOutButton />
            </div>
        </aside>
    );
}
 
export default Sidebar;