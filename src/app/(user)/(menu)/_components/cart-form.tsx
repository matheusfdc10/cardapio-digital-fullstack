"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { MenuType } from '@/types';
// import { CartItem } from '@/hooks/useCart';
import { Textarea } from '@/components/ui/textarea';
import Image from '@/components/image';
import { IoIosArrowBack, IoMdAdd, IoMdRemove } from 'react-icons/io';
import { capitalizeFirstLetter, cn, formatPrice } from '@/lib/utils';
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";

const CartAdditionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
});

const CartCategryAdditionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  isRequired: z.boolean(),
  maxItems: z.number().int().nonnegative(),
  additionals: z.array(CartAdditionalSchema),
}).superRefine((category, ctx) => {
  const amountAdditionals = category.additionals.reduce((amount, additional) => additional.quantity + amount, 0);
  const maxItems = category.maxItems;
  const isRequired = category.isRequired;

  if (maxItems === 0) {
    if (isRequired && amountAdditionals < 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione pelo menos 1 opção',
      });
    }
  } else if (maxItems === 1) {
    if (isRequired && amountAdditionals !== 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione 1 opção',
      });
    } else if (!isRequired && amountAdditionals > 1) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecione até 1 opção',
      });
    }
  } else {
    if (isRequired && amountAdditionals !== maxItems) {
      ctx.addIssue({
        code: 'custom',
        message: `Selecione ${maxItems} opções`,
      });
    } else if (!isRequired && amountAdditionals > maxItems) {
      ctx.addIssue({
        code: 'custom',
        message: `Selecione até ${maxItems} opções`,
      });
    }
  }
});


// .refine((category) => {
//   const amountAdditionals = category.additionals.reduce((amount, additional) => additional.quantity + amount, 0)
//   const maxItems = category.maxItems
//   const isRequired = category.isRequired

//   if(maxItems === 0 && isRequired) {
//     if(amountAdditionals >= 1) {
//       return true // passou
//     }
//     return false // error SELECIONE PELO MENOS 1
//   }

//   if(maxItems === 0 && !isRequired) {
//     return true // passou SELECIONE QUANTOS QUISER
//   }


//   if(maxItems === 1 && isRequired) {
//     if(amountAdditionals === 1) {
//       return true // passou SELECIONE 1 OPÇÃO
//     }
//     return false // error SELECIONE 1 OPÇÃO
//   }

//   if(maxItems === 1 && !isRequired) {
//     if(amountAdditionals > 1) {
//       return false // error SELECIONE ATÉ 1 OPÇÃO
//     }
//     return true // passou 1 OU NENHUM OPÇÃO
//   }

//   if(maxItems >= 2 && isRequired) {
//     if(amountAdditionals === maxItems) {
//       return true // passou SELECIONOU A MSM QTDE DO MAXIMO OBRIGATORIO
//     }
//     return false // error SELECIONE A QUANTIDADE MAXIMA
//   }

//   if(maxItems >= 2 && !isRequired) {
//     if(amountAdditionals <= maxItems) {
//       return true // passou SELECIONOU ATE A QTDE MAXIMA
//     }
//     return false  // error SELECIONE ATE QUANTIDADE MAXIMA
//   }
// }, {
//   message: `Escolha ${category.maxItems}`,
// })

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  price: z.number().nonnegative(),
  comment: z.string().optional(),
  quantity: z.number().int().nonnegative(),
  additionalCategories: z.array(CartCategryAdditionalSchema),
});

type CartAdditionalType = z.infer<typeof CartAdditionalSchema>;
type CartCategryAdditionalType = z.infer<typeof CartCategryAdditionalSchema>;
type CartType = z.infer<typeof CartItemSchema>;

interface CartFormProps {
  dish: MenuType['dishes'][number];
  initialData?: CartType | null;
  onClose: () => void;
}

const CartForm: React.FC<CartFormProps> = ({ 
  dish, 
  initialData, 
  onClose 
}) => {
  type CategoryIsValid = {
    [key: string]: boolean | undefined;
  };
  const [categoryIsValid, setCategoryIsValid] = useState<CategoryIsValid>({})
  
  const form = useForm<CartType>({
    resolver: zodResolver(CartItemSchema),
    defaultValues: initialData || {
      id: dish.id,
      name: dish.name,
      url: dish.image || undefined,
      price: dish.price,
      comment: '',
      quantity: 1,
      additionalCategories: [
        ...dish.additionalCategories.map((additionalCategory) => ({
          id: additionalCategory.id,
          name: additionalCategory.name,
          isRequired: additionalCategory.isRequired,
          maxItems: additionalCategory.maxItems,
          additionals: [
            ...additionalCategory.additionals.map((additional) => ({
              id: additional.id,
              name: additional.name,
              price: additional.price,
              quantity: 0,
            }))
          ]
        }))
      ],
    },
  });
  
  const onSubmit = (data: CartType) => {
    console.log(data);
  };

  const isLoading = form.formState.isSubmitting;

  // const handleGetCategoryAdditioanl = (id: string) => {
  //   const category = dish.additionalCategories.find((category) => category.id === id);
  //   return category
  // }

  const handleAddDish = () => {
    form.setValue('quantity', form.watch('quantity') + 1);
  }

  const handleRemoveDish = () => {
    if (form.watch('quantity') > 1) {
      form.setValue('quantity', form.watch('quantity') - 1);
    }
  }

  const setValidCategory = (index: string) => {
    setCategoryIsValid((categories) => {
      const { [index]: _, ...newCategories } = categories;
      if (categoryIsValid[index]) {
        return newCategories; // Remove a chave index do objeto
      } else {
        return {
          ...newCategories,
          [index]: true, // Adiciona a chave index com valor true
        };
      }
    });
  };
  
  // adicionar qntidade de adiconai
  const handleAddAdditional = async (item: CartAdditionalType, indexCategory: number) => {
    const category = form.watch(`additionalCategories.${indexCategory}`) as CartCategryAdditionalType;
    const indexAdditional = category.additionals.findIndex((additional) => additional.id === item.id);
    
    const maxItems = category.maxItems;
    const quantityItems = category.additionals.reduce((amount, additionals) => additionals.quantity + amount ,0)
    
    if (maxItems === 0) {
      form.setValue(`additionalCategories.${indexCategory}.additionals.${indexAdditional}.quantity`, item.quantity + 1)
      // return
      if (quantityItems === 0) {
        const res = await form.trigger(`additionalCategories.${indexCategory}`)
        if (res && category.isRequired) {
          setValidCategory(category.id)
        }
      }
    }
    
    if (maxItems > quantityItems) {
      form.setValue(`additionalCategories.${indexCategory}.additionals.${indexAdditional}.quantity`, item.quantity + 1)
      if (maxItems === quantityItems + 1) {
        // revalidar
        const res = await form.trigger(`additionalCategories.${indexCategory}`)
        if (res && category.isRequired) {
          setValidCategory(category.id)
        }
      }
      // return
    }

    // form.setError(`additionalCategories.${indexCategory}`, {
    //   type: 'maxItems',
    //   message: `{}`
    // })

    // const additionals = form.getValues('additionals')   
    // const additional = additionals.find((additional) => additional.id === item.id)
    
    // if (additional) {
    //     form.setValue('additionals', [
    //       ...additionals.filter((add) => add.id !== item.id),
    //       { ...additional, quantity: additional.quantity + 1 }
    //     ])
    // } else {
    //     form.setValue('additionals', [
    //         ...additionals,
    //         {
    //             ...item,
    //             quantity: 1,
    //             categoryId: categoryId
    //         }
    //     ])
    // }
  }

  const handleRemoveAdditional = async (item: CartAdditionalType, indexCategory: number) => {
    const category = form.watch(`additionalCategories.${indexCategory}`) as CartCategryAdditionalType;
    const indexAdditional = category.additionals.findIndex((additional) => additional.id === item.id);
    
    const maxItems = category.maxItems;
    const quantityItems = category.additionals.reduce((amount, additionals) => additionals.quantity + amount ,0)

    if (quantityItems > 0) {
      form.setValue(`additionalCategories.${indexCategory}.additionals.${indexAdditional}.quantity`, item.quantity - 1)
      if (quantityItems === 1 && category.isRequired) {
        const res = await form.trigger(`additionalCategories.${indexCategory}`)
        if ((quantityItems === category.maxItems || category.maxItems === 0)  && category.isRequired) {
          setValidCategory(category.id)
        }
      }
    } 
    
    if (quantityItems === category.maxItems && category.isRequired) {
      setValidCategory(category.id)
    }
    
    // const indexCategory = form.watch('additionalCategories').findIndex((category) => category.id === id)
    // const category = form.watch(`additionalCategories.${indexCategory}`) as CartCategryAdditionalType;





    // const additionals = form.getValues('additionals')   
    // const additional = additionals.find((additional) => additional.id === id)

    // if(additional && additional.quantity > 1) {
    //     form.setValue('additionals', [
    //         ...additionals.filter((add) => add.id !== id),
    //         { ...additional, quantity: additional.quantity - 1 }
    //     ])
    // } else {
    //     form.setValue('additionals', [
    //         ...additionals.filter((add) => add.id !== id)
    //     ])
    // }
  }

  // const amountAdditional = (item: MenuType['dishes'][number]['additionalCategories'][number]['additionals'][number]) => {
  //   return form.watch('additionals').find((add) => add.id === item.id)?.quantity
  // }

  const totalPrice = (form.watch('additionalCategories').reduce((acc, category) => acc + (category.additionals.reduce((accc, additional) => accc + (additional.quantity * additional.price) ,0)) ,0) + dish.price) * form.watch('quantity');
  // const totalPrice = (form.watch('additionals').reduce((acc, additioanl) => (additioanl.price * additioanl.quantity) + acc ,0) + dish.price) * form.watch('quantity');

  // console.log(form.formState.errors)

  const quantityAdditionalSelected  = (index: number) => {
    const category = form.watch(`additionalCategories.${index}`) as CartCategryAdditionalType
    return category.additionals.reduce((amount, additional) => additional.quantity + amount, 0)
  }

  const categoryAdditionalsError = (index: number) => {
    return form.formState.errors?.additionalCategories?.[index]?.message;
  }



  return (
    <>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex-1 flex flex-col"
        >
          <div className='sticky top-0 z-40 bg-white'>
            <div className='relative w-full h-14 flex justify-center items-center'>
              <div onClick={onClose} className='absolute left-5 cursor-pointer'>
                <IoIosArrowBack className='w-6 h-6' />
              </div>
              <h1 className='text-center text-sm sm:text-base font-semibold uppercase mx-14'>
                {dish.name}
              </h1>
            </div>
          </div>

          {dish.image && (
            <div className='relative h-60 w-full sm:h-48 sm:w-96 overflow-hidden mx-auto sm:rounded-lg'>
              <Image
                src={dish.image}
                alt={dish.name}
                fill
                modal
              />
            </div>
          )}

          <div className='mx-4 sm:mx-8 my-4 flex flex-col gap-2'>
            <h2 className='text-xl font-bold leading-tight'>
              {capitalizeFirstLetter(dish.name)}
            </h2>
            <p className='whitespace-pre-line leading-5 text-muted-foreground'>
              {dish.description}
            </p>
            <span className='mt-4 font-bold'>
              {formatPrice(dish.price)}
            </span>
          </div>

          {/* <FormField
            control={form.control}
            name="additionalCategories"
            render={({ field }) => (
              <FormItem>
                {field.value.map((category, indexCategory) => (
                  <FormItem key={indexCategory}>
                    <div>
                      <h2>{category.name}</h2>
                    </div>
                    <FormControl>
                      {category.additionals.map((additional, indexItem) => (
                        <FormItem key={indexItem}>
                          <div>
                            {additional.name} + {additional.price}
                          </div>
                          <FormControl>
                            - 0 +
                          </FormControl>
                        </FormItem>
                      ))}
                    </FormControl>
                  </FormItem>
                ))}
              </FormItem>
            )}
          /> */}

          {/* ADDITIONALS */}
          {!!form.watch('additionalCategories').length && (
            <ul className='sm:max-h-[356px] sm:overflow-y-auto border-b'>
              {form.watch('additionalCategories').map((category, indexCategory) => (
                <li 
                  key={category.id} 
                  className=""
                >
                  <div className="sticky top-[56px] z-30 sm:static py-3 px-4 sm:px-8 bg-zinc-200 flex justify-between gap-4 items-center">
                    {/* <input type="text" {...fields[i]}/> */}
                    <div className="flex-1 flex flex-col gap-2 justify-between">
                      <p className="font-semibold text-sm sm:text-base leading-5 break-words">
                        {capitalizeFirstLetter(category.name)}
                      </p>

                      <span className={cn(
                        "text-xs sm:text-sm",
                        !!categoryAdditionalsError(indexCategory) ? "text-red-500 font-semibold" : "text-muted-foreground"

                      )}>
                        {/* sem limites e obrigatoirio */}
                        {category.maxItems === 0 && category.isRequired && (
                          'Escolha pelo menos 1 opção.'
                        )}

                        {/* sem limites e opcional */}
                        {category.maxItems === 0 && !category.isRequired && (
                          'Escolha quantas opções quiser.'
                        )}

                        {/* 1 item e obrigatoirio */}
                        {category.maxItems === 1 && category.isRequired && (
                          'Escolha 1 opção.'
                        )}

                        {/* 1 item e opcional */}
                        {category.maxItems === 1 && !category.isRequired && (
                          'Escolha até 1 opção.'
                        )}

                        {/* mais q 1 item e obrigatorio */}
                        {category.maxItems > 1 && category.isRequired && (
                          `Escolha ${category.maxItems} opções.`
                        )}

                        {/* mais q 1 item e opcional */}
                        {category.maxItems > 1 && !category.isRequired && (
                          `Escolha até ${category.maxItems} opções`
                        )}
                      </span>
                    </div>
                    <div className="text-end transition">
                      <FormField
                        control={form.control}
                        name={`additionalCategories.${indexCategory}`}
                        render={({ field }) => (
                          
                            <FormControl>
                              <input
                                className="w-0 h-0"
                                disabled={isLoading}
                                name={field.name}
                                ref={field.ref}
                                onBlur={field.onBlur}
                                {...field.onChange}
                              />
                            </FormControl>
                          
                        )}
                      />
                      {categoryIsValid[category.id] ? (
                        <FaCheck className="h-6 w-6 text-green-500 inline-block" />
                      ) : (
                        <>
                          <span className="inline-block text-[10px] sm:text-xs font-semibold text-white tracking-wider bg-zinc-500/80 rounded-sm px-2 py-1 h-6">
                            {quantityAdditionalSelected(indexCategory)}
                            {!!category.maxItems ? `/${category.maxItems}` : ' itens'}
                          </span>
                          <span className={cn(
                            "inline-block text-[10px] line sm:text-xs font-semibold text-white tracking-wider  rounded-sm px-2 py-1 h-6 ml-2",
                            !!categoryAdditionalsError(indexCategory) ? "bg-red-500/80" : "bg-zinc-500/80"

                          )}>
                            {category.isRequired ? 'Obrigatório' : 'Opcional'}
                          </span>
                        </>
                      )}
                      {/* <span className="block text-xs text-red-500 font-bold mt-1">
                        {categoryAdditionalsError(indexCategory)}
                      </span> */}

                    </div>
                  </div>

                  <ul className="divide-y">
                    {category.additionals.map((additional, indexAdditional) => (
                      <li
                        key={additional.id}
                        className="flex justify-between items-center gap-4 py-6 px-4 sm:px-8"
                      >
                        <div className="text-sm font-medium sm:text-base sm:font-normal">
                          <span>
                            {capitalizeFirstLetter(additional.name)}
                          </span>
                          {!!additional.price && (
                            <span className="whitespace-nowrap">
                              {` + ${formatPrice(additional.price)}`}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 transition">
                          {!!additional.quantity && (
                            <>
                              <button
                                onClick={() => handleRemoveAdditional(additional, indexCategory)}
                                type='button'
                                className='rounded-full bg-red-500 p-1 disabled:bg-zinc-300 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
                                disabled={isLoading}
                              >
                                <IoMdRemove className='w-6 h-6 text-white'/>
                              </button>
                              <span>
                                {additional.quantity}
                              </span>
                            </>
                          )}
                          <button
                            onClick={() => handleAddAdditional(additional, indexCategory)}
                            disabled={isLoading || quantityAdditionalSelected(indexCategory) === category.maxItems && !(category.maxItems === 0)}
                            type='button'
                            className='rounded-full bg-green-500 disabled:opacity-50 p-1 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
                          >
                            <IoMdAdd className='w-6 h-6 text-white'/>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}

          <div className='mx-4 sm:mx-8 my-4'>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Algum Comentário?</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      placeholder="Ex: Retirar cebola"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className='sticky bottom-0 z-40 bg-white flex-1 flex  flex-wrap gap-6 items-end px-6 py-3'>
            <div className='flex items-center gap-3'>
              <button
                onClick={handleRemoveDish}
                type='button'
                className='rounded-full bg-red-500 p-1 disabled:bg-zinc-300 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
                disabled={isLoading || form.watch('quantity') === 1}
              >
                <IoMdRemove className='w-6 h-6 text-white'/>
              </button>
              <span className='text-xl font-semibold'>
                {form.watch('quantity')}
              </span>
              <button
                onClick={handleAddDish}
                disabled={isLoading}
                type='button'
                className='rounded-full bg-green-500 p-1 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed'
              >
                <IoMdAdd className='w-6 h-6 text-white'/>
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className={cn(
                'flex-1',
                !!Object.keys(form.formState.errors).length && 'opacity-50'
              )}
            >
              Adicionar • {formatPrice(totalPrice)}
            </Button>
          </div>
        </form>
      </Form>













      
    </>
  );
};

export default CartForm;