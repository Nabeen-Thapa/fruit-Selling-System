import { useState } from "react";
import { addTocart, deleteFromCart, viewMyCart } from "../../services/cart.services";
import { toast } from "react-toastify";
import { CartItemType } from "../../types/product.type";


export const useCart = () => {
  const [cart, setCart] = useState<any>(null);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]); // ✅ fixed type here
  const [loading, setLoading] = useState(false);

  const addNewItemToCart = async (productId: string, quantity: number) => {
    try {
      setLoading(true);
      const response = await addTocart(productId, quantity);
      toast.success("Item added to cart");
      setCart(response);
      setCartItems(response.items || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const viewMyCartItems = async () => {
    try {
      setLoading(true);
      const response = await viewMyCart();
      toast.success("Cart loaded");
      setCartItems(response?.data?.items || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (itemId: string, quantity:number) => {
    try {
      setLoading(true);
      const deleteResponce = await deleteFromCart(itemId, quantity);
      toast.success("imte deleted successfully form cart");
       await viewMyCartItems(); 
    } catch (error) {
      toast.error(error.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }

  return { addNewItemToCart, cart, cartItems, viewMyCartItems, loading,deleteCartItem };
};
