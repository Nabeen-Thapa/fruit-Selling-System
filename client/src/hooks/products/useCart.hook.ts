import { useState } from "react";
import { addTocart } from "../../services/cart.services";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cart, setCart] = useState(null);

  const addNewItemToCart = async (productId: string, quantity: number) => {
    try {
      const response = await addTocart(productId, quantity);
      toast.success("Item added to cart");
      setCart(response); // if needed
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    }
  };

  return { addNewItemToCart, cart };
};
