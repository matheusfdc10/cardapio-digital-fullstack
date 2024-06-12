import DishCategoryForm from "./_components/dish-category-form";
// import { ProductsClient } from "@/app/(dashboard)/(routes)/products/components/client";
import { Separator } from "@/components/ui/separator";
import getDishCategoryId from "@/actions/getDishCategoryId";

export const revalidate = 0;

const DishCategoryPage = async ({
    params
}: {
    params: { dishCategoryId: string }
}) => {
    const dishCategory = await getDishCategoryId(params.dishCategoryId)

    const formattedProducts = dishCategory?.dishes?.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category.name,
        price: item.price.toString(),
        status: item.status,
        image: item.image
    }))

    return (
        <div className="space-y-16">
            <DishCategoryForm initialDate={dishCategory}/>
            {/* <Separator /> */}
            {/* {params.sishCategoryId !== 'new' && (
                <ProductsClient data={formattedProducts || []}/>
            )} */}
        </div>
    )
}

export default DishCategoryPage;