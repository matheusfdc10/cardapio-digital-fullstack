
import { auth, signOut } from "@/auth";

const MenuPage = async () => {
  const session = await auth();

  return (
    <div>
      <h1>Menu</h1>
      <p>{JSON.stringify(session)}</p>
      <form action={async () => {
        "use server";
        await signOut();
      }}>

        <button type="submit">SAIR</button>
      </form>
    </div>
  );
}
 
export default MenuPage;
