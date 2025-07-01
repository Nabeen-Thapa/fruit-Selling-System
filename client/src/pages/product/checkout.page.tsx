import React, { useEffect } from 'react';
import { useCart } from '../../hooks/products/useCart.hook';
import Checkout from '../../components/products/checkout';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
    const location = useLocation();
  const { cartItems, viewMyCartItems, loading } = useCart();

   const state = location.state as {
    product?: any;
    quantity?: number;
  };

 useEffect(() => {
    if (!state?.product) {
      viewMyCartItems();
    }
  }, []);

 const itemsToCheckout = state?.product
    ? [
        {
          id: state.product.id,
          quantity: state.quantity || 1,
          price: state.product.price,
          totalPrice: (state.quantity || 1) * parseFloat(state.product.price),
          product: state.product,
        },
      ]
    : cartItems;

  
  return (
    <Checkout
      cartItems={itemsToCheckout}
      viewMyCartItems={viewMyCartItems}
      loading={loading}
    />
  );
};
export default CheckoutPage;