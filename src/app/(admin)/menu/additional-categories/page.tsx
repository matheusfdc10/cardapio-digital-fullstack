import ToastError from "@/components/toast-error";
import { AdditionalCategoriesClient } from "./_components/client";
import { getAdditionalCategories } from "@/actions/admin/additional-category";

export const revalidate = 0;

const AdditionalCategoriesPage = async () => {
    const response = await getAdditionalCategories();

    if (response.error) {
        return (
            <ToastError
                errorMessage='Erro ao buscar categorias de adicionais'
                toastMessage={response.error}
            />
        )
    }

    return (
        <AdditionalCategoriesClient data={response.data} />
    );
}
 
export default AdditionalCategoriesPage;