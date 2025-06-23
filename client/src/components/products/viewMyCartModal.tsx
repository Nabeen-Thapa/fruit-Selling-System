import { MdClose } from "react-icons/md";
import React, { useEffect } from "react";
import { useCart } from "../../hooks/products/useCart.hook";

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, viewMyCartItems, loading } = useCart();

  useEffect(() => {
    if (isOpen) {
      viewMyCartItems();
    }
  }, [isOpen]);

  const subtotal =
    cartItems?.reduce((sum, item) => {
      const price = parseFloat(item.price || item.totalPrice || "0");
      return sum + price;
    }, 0) || 0;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div
          className="inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:align-middle"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Your Shopping Cart
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <MdClose className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="py-6 text-center text-gray-500">
                Your cart is empty.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id || item._id} className="py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          item.product?.images?.[0]?.url ||
                          "https://via.placeholder.com/80"
                        }
                        alt={item.product?.name || "Product"}
                        className="h-16 w-16 rounded border object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">
                            {item.product?.name || "Unnamed"}
                          </h4>
                          <span className="text-gray-700">
                            NRS.{parseFloat(item.price || item.totalPrice || "0").toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-1">
                          <p>Qty: {item.quantity}</p>
                          <button className="text-indigo-600 hover:underline">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 px-4 py-6 sm:px-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>NRS.{subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <button className="w-full rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 shadow-sm">
                Checkout
              </button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              <button
                type="button"
                className="text-indigo-600 hover:text-indigo-500"
                onClick={onClose}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
