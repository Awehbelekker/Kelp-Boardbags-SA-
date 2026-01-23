import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Cart } from '@/types'
import { calculateShipping } from '@/lib/utils'

interface CartState {
  items: CartItem[]
  couponCode: string | null
  discountAmount: number

  // Cart actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void

  // Cart calculations
  getCart: () => Cart
  getItemCount: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,

      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          )

          if (existingItemIndex > -1) {
            // Update quantity of existing item
            const updatedItems = [...state.items]
            const existingItem = updatedItems[existingItemIndex]
            const newQuantity = existingItem.quantity + (newItem.quantity || 1)

            // Don't exceed max quantity
            if (newQuantity <= existingItem.maxQuantity) {
              updatedItems[existingItemIndex] = {
                ...existingItem,
                quantity: newQuantity,
              }
              return { items: updatedItems }
            }

            return state
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                ...newItem,
                quantity: newItem.quantity || 1,
              } as CartItem,
            ],
          }
        })
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                (variantId === undefined || item.variantId === variantId)
              )
          ),
        }))
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.productId === productId &&
              (variantId === undefined || item.variantId === variantId)
            ) {
              // Don't exceed max quantity
              const newQuantity = Math.min(quantity, item.maxQuantity)
              return { ...item, quantity: newQuantity }
            }
            return item
          }),
        }))
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountAmount: 0 })
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, discountAmount: discount })
      },

      removeCoupon: () => {
        set({ couponCode: null, discountAmount: 0 })
      },

      getCart: (): Cart => {
        const state = get()
        const subtotal = state.getSubtotal()

        // Calculate discount (either percentage or fixed amount)
        const discount = state.discountAmount

        // Calculate shipping based on total weight
        // For now, using a simple calculation - can be enhanced
        const totalWeight = state.items.reduce((sum, item) => sum + (item.quantity * 0.5), 0)
        const shipping = calculateShipping(totalWeight, 'ZA')

        // Calculate tax (15% VAT for South Africa)
        const taxableAmount = subtotal - discount
        const tax = taxableAmount * 0.15

        const total = subtotal - discount + shipping + tax

        return {
          items: state.items,
          subtotal,
          discount,
          shipping,
          tax,
          total,
        }
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'kelp-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
