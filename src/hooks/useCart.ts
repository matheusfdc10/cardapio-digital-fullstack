import { toast } from "@/components/ui/use-toast";
import { date } from "@/lib/utils";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartAdditionalType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CartAdditionalCartCategoryType {  // Corrigido o nome para 'CartAdditionalCartCategoryType'
  id: string;
  name: string;
  isRequired: boolean;
  maxItems: number;
  additionals: CartAdditionalType[];  // Corrigido para ser um array de 'CartAdditional'
}

export interface CartItemType {
  id: string;
  dishId: string;
  name: string;
  url?: string;
  price: number;
  comment?: string;
  quantity: number;
  additionalCategories: CartAdditionalCartCategoryType[];  // Corrigido o nome para 'CartAdditionalCartCategoryType'
}

interface CartState {
  cart: CartItemType[];
  totalItems: number;
  totalAmount: number;
  cartCreatedAt: Date;
  addToCart: (item: CartItemType) => void;
  removeFromCart: (id: string) => void;
  updateItemFromCart: (item: CartItemType) => void;
  clearCart: () => void;
}

const useCart = create(
  persist<CartState>(
    (set, get) => ({
      cart: [],
      totalItems: 0,
      totalAmount: 0,
      cartCreatedAt: date(),
      addToCart: (item) => set((state) => {
        const existingItemIndex = state.cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex >= 0) {
          toast({
            title: 'Error',
            variant: "destructive"
          })

          return state;
        }

        const updatedCart = [...state.cart, item];

        const updatedTotalItems = updatedCart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
        const updatedTotalAmount = updatedCart.reduce((acc, cartItem) => (cartItem.price * cartItem.quantity) + acc +
        cartItem.quantity *  cartItem.additionalCategories.reduce((addAcc, category) =>
            addAcc + category.additionals.reduce((subAddAcc, additional) =>
              subAddAcc + (additional.price * additional.quantity), 0), 0), 0);

        return { cart: updatedCart, totalItems: updatedTotalItems, totalAmount: updatedTotalAmount };
      }),

      removeFromCart: (id) => set((state) => {
        const updatedCart = state.cart.filter(cartItem => cartItem.id !== id);
        const updatedTotalItems = updatedCart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
        const updatedTotalAmount = updatedCart.reduce((acc, cartItem) => (cartItem.price * cartItem.quantity) + acc +
        cartItem.quantity *  cartItem.additionalCategories.reduce((addAcc, category) =>
            addAcc + category.additionals.reduce((subAddAcc, additional) =>
              subAddAcc + (additional.price * additional.quantity), 0), 0), 0);

        return { cart: updatedCart, totalItems: updatedTotalItems, totalAmount: updatedTotalAmount };
      }),

      updateItemFromCart: (item) => set((state) => {
        const updatedCart = state.cart.filter((cartItem) => {
          if (cartItem.id === item.id) {
            return item.quantity > 0 ? true : false
          } else {
            return true
          }
        }).map(cartItem =>
          cartItem.id === item.id
            ? item
            : cartItem
        );

        const updatedTotalItems = updatedCart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
        const updatedTotalAmount = updatedCart.reduce((acc, cartItem) => (cartItem.price * cartItem.quantity) + acc +
        cartItem.quantity *  cartItem.additionalCategories.reduce((addAcc, category) =>
            addAcc + category.additionals.reduce((subAddAcc, additional) =>
              subAddAcc + (additional.price * additional.quantity), 0), 0), 0);

        return { cart: updatedCart, totalItems: updatedTotalItems, totalAmount: updatedTotalAmount };
      }),

      clearCart: () => set(() => ({ cart: [], totalItems: 0, totalAmount: 0 }))
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useCart;
















// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// interface CartAdditional {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   categoryId: string;
// }

// interface CartItem {
//   id: string;
//   name: string;
//   url: string;
//   price: number;
//   comment: string;
//   quantity: number;
//   additionals: CartAdditional[];
// }

// interface CartState {
//   cart: CartItem[];
//   totalItems: number;
//   totalAmount: number;
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (id: string) => void;
//   updateCart: (item: CartItem) => void;
//   clearCart: () => void;
// }

// const useCart = create(
//   persist<CartState>(
//     (set, get) => ({
//       cart: [],
//       totalItems: 0,
//       totalAmount: 0,

//       addToCart: (item) => set((state) => {
//         const existingItemIndex = state.cart.findIndex(cartItem => cartItem.id === item.id);
//         let updatedCart;

//         if (existingItemIndex >= 0) {
//           // Atualizar a quantidade do item existente
//           updatedCart = state.cart.map(cartItem =>
//             cartItem.id === item.id
//               ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
//               : cartItem
//           );
//         } else {
//           // Adicionar novo item ao carrinho
//           updatedCart = [...state.cart, item];
//         }

//         const updatedTotalItems = updatedCart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
//         const updatedTotalAmount = updatedCart.reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity +
//           cartItem.additionals.reduce((addAcc, additional) => addAcc + additional.price * additional.quantity, 0), 0);

//         return { cart: updatedCart, totalItems: updatedTotalItems, totalAmount: updatedTotalAmount };
//       }),

//       removeFromCart: (id) => set((state) => {
//         const updatedCart = state.cart.filter(cartItem => cartItem.id !== id);
//         const updatedTotalItems = updatedCart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
//         const updatedTotalAmount = updatedCart.reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity +
//           cartItem.additionals.reduce((addAcc, additional) => addAcc + additional.price * additional.quantity, 0), 0);

//         return { cart: updatedCart, totalItems: updatedTotalItems, totalAmount: updatedTotalAmount };
//       }),

//       updateCart: (item) => set((state) => {
//         const updatedCart = state.cart.map(cartItem =>
//           cartItem.id === item.id
//             ? item
//             : cartItem
//         );

//         const updatedTotalItems = updatedCart.reduce((acc, cartItem) => acc + cartItem.quantity, 0);
//         const updatedTotalAmount = updatedCart.reduce((acc, cartItem) => acc + cartItem.price * cartItem.quantity +
//           cartItem.additionals.reduce((addAcc, additional) => addAcc + additional.price * additional.quantity, 0), 0);

//         return { cart: updatedCart, totalItems: updatedTotalItems, totalAmount: updatedTotalAmount };
//       }),

//       clearCart: () => set(() => ({ cart: [], totalItems: 0, totalAmount: 0 }))
//     }),
//     {
//       name: "cart-storage",
//       storage: createJSONStorage(() => localStorage)
//     }
//   )
// );

// export default useCart;