"use client"

import { useCartStore } from '@/store/cart-store'
import { CartItem } from '@/types'

export function useCart() {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    getCart,
    getItemCount,
    getSubtotal,
    couponCode,
    discountAmount,
  } = useCartStore()

  const cart = getCart()
  const itemCount = getItemCount()

  return {
    items,
    cart,
    itemCount,
    couponCode,
    discountAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  }
}
