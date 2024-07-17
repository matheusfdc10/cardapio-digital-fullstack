"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { MenuType } from '@/types';
import { CartItem } from '@/hooks/useCart';
import { Textarea } from '@/components/ui/textarea';
import Image from '@/components/image';
import { IoIosArrowBack, IoMdAdd, IoMdRemove } from 'react-icons/io';
import { formatPrice } from '@/lib/utils';

const cartAdditionalSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().nonnegative(),
  categoryId: z.string(),
});

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().optional(),
  price: z.number().nonnegative(),
  comment: z.string().optional(),
  quantity: z.number().int().nonnegative(),
  additionals: z.array(cartAdditionalSchema),
});

interface CartFormProps {
  dish: MenuType['dishes'][number];
  initialData?: CartItem | null;
  onClose: () => void;
}

const CartForm: React.FC<CartFormProps> = ({ 
  dish, 
  initialData, 
  onClose 
}) => {
  const form = useForm<CartItem>({
    resolver: zodResolver(cartItemSchema),
    defaultValues: initialData || {
      id: dish.id,
      name: dish.name,
      url: dish.image || undefined,
      price: dish.price,
      comment: '',
      quantity: 1,
      additionals: [],
    },
  });

  const onSubmit = (data: CartItem) => {
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

  // verificar o categoria de adiconal para validar a qntdd
  const handleAddAdditional = (item: MenuType['dishes'][number]['additionalCategories'][number]['additionals'][number], categoryId: string) => {
    const additionals = form.getValues('additionals')   
    const additional = additionals.find((additional) => additional.id === item.id)
    
    if (additional) {
        form.setValue('additionals', [
          ...additionals.filter((add) => add.id !== item.id),
          { ...additional, quantity: additional.quantity + 1 }
        ])
    } else {
        form.setValue('additionals', [
            ...additionals,
            {
                ...item,
                quantity: 1,
                categoryId: categoryId
            }
        ])
    }
  }

  const handleRemoveAdditional = (id: string) => {
    const additionals = form.getValues('additionals')   
    const additional = additionals.find((additional) => additional.id === id)

    if(additional && additional.quantity > 1) {
        form.setValue('additionals', [
            ...additionals.filter((add) => add.id !== id),
            { ...additional, quantity: additional.quantity - 1 }
        ])
    } else {
        form.setValue('additionals', [
            ...additionals.filter((add) => add.id !== id)
        ])
    }
  }

  const amountAdditional = (item: MenuType['dishes'][number]['additionalCategories'][number]['additionals'][number]) => {
    return form.watch('additionals').find((add) => add.id === item.id)?.quantity
  }

  const totalPrice = (form.watch('additionals').reduce((acc, additioanl) => (additioanl.price * additioanl.quantity) + acc ,0) + dish.price) * form.watch('quantity');

  //   console.log(form.formState.errors)

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
              />
            </div>
          )}

          <div className='mx-8 my-4 flex flex-col gap-2'>
            <h2 className='text-xl font-bold leading-tight'>
              {dish.name}
            </h2>
            <p className='whitespace-pre-line leading-5 text-muted-foreground'>
              {dish.description}
            </p>
            <span className='mt-4 font-bold'>
              {formatPrice(dish.price)}
            </span>
          </div>

          {/* ADDITIONALS */}
          <ul className='sm:max-h-[356px] sm:overflow-y-auto border-b'>
            {dish.additionalCategories.map((category, i) => (
              <li 
                key={category.id} 
                className=""
              >

                <div className="sticky top-[56px] z-30 sm:static py-3 px-8 bg-zinc-200 flex justify-between items-center">
                  {/* <input type="text" {...fields[i]}/> */}
                  <div>
                    <h3 className="font-semibold">
                      {category.name}
                    </h3>

                    <span className="text-sm text-muted-foreground">
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
                  <div>
                    <span className="text-xs font-semibold text-white tracking-wider bg-zinc-500/80 rounded-sm px-2 py-1">
                      {category.isRequired ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                </div>

                <ul className="divide-y">
                  {category.additionals.map((additional, index) => (
                    <li
                      key={additional.id}
                      className="flex justify-between items-center gap-3 py-6 px-8"
                    >
                      <div className="text-sm font-medium sm:text-base sm:font-normal">
                        <span>
                          {additional.name}
                        </span>
                        {!!additional.price && (
                          <span>
                            {` + ${formatPrice(additional.price)}`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 transition">
                        {amountAdditional(additional) && (
                          <>
                            <button
                              onClick={() => handleRemoveAdditional(additional.id)}
                              type='button'
                              className='rounded-full bg-red-500 p-1 disabled:bg-zinc-300'
                              disabled={isLoading}
                            >
                              <IoMdRemove className='w-6 h-6 text-white'/>
                            </button>
                            <span>
                              {amountAdditional(additional)}
                            </span>
                          </>
                        )}
                        <button
                          onClick={() => handleAddAdditional(additional, category.id)}
                          disabled={isLoading}
                          type='button'
                          className='rounded-full bg-green-500 p-1'
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

          <div className='mx-8 my-4'>
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
                className='rounded-full bg-red-500 p-1 disabled:bg-zinc-300'
                disabled={isLoading || form.watch('quantity') < 2}
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
                className='rounded-full bg-green-500 p-1'
              >
                <IoMdAdd className='w-6 h-6 text-white'/>
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className='flex-1'
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