import { MdClose } from "react-icons/md";
import React, { useEffect } from "react";
import { useCart } from "../../hooks/products/useCart.hook";
import { FiTrash2 } from "react-icons/fi";
import { CartModalProps } from "../../types/product.type";
import { Link } from "react-router-dom";



const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, viewMyCartItems, loading, deleteCartItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      viewMyCartItems();
    }
  }, [isOpen]);

  const subtotal =
    cartItems?.reduce((sum, item) => {
      const price = parseFloat(item.totalPrice || "0");
      return sum + price;
    }, 0) || 0;

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}>
      {/* Overlay with backdrop blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal container with smooth animation */}
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div
          className="inline-block w-full max-w-lg max-h-[98vh] overflow-y-auto transform rounded-2xl bg-white text-left shadow-xl transition-all"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with modern styling */}
          <div className="sticky top-0 bg-white p-4 border-b border-gray-100 z-10">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Your Shopping Cart
                {cartItems && cartItems.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                  </span>
                )}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <MdClose className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Cart Items with better spacing */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-gray-500">Loading your cart...</p>
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="flex flex-col items-center py-12 px-4">
                <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900">Your cart is empty</h4>
                <p className="mt-1 text-gray-500">Add some items to get started</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={item.id || item._id} className="py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
                        <img
                          src={
                            item.product?.images?.[0]?.url
                          }
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute top-1 right-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <h4 className="text-base font-medium text-gray-900 line-clamp-2">
                            {item.product?.name || "Unnamed"}
                          </h4>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 whitespace-nowrap ml-1">
                              NRS {parseFloat(item.price || "0").toFixed(2)}/{item.product?.quantityType}
                            </span>
                            <span className="text-base font-medium text-gray-900 whitespace-nowrap ml-4">
                              NRS {parseFloat(item.totalPrice || "0").toFixed(2)}
                            </span>
                            <button className="text-blue-500 hover:text-red-800 transition-colors" onClick={() => deleteCartItem(item.id!, item.quantity!)}>
                              <FiTrash2 className="h-6 w-6 mx-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} {item.product?.quantityType}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer with sticky positioning */}
          {cartItems && cartItems.length > 0 && (
            <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-6 shadow-sm">
              <div className="flex justify-between text-lg font-bold text-gray-900 mb-2">
                <p>Subtotal</p>
                <p>NRS {subtotal.toFixed(2)}</p>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                to="/falful/product/checkout"
                onClick={onClose}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-base font-bold text-white hover:bg-blue-700 transition-colors shadow-sm block text-center"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={onClose}
                className="w-full mt-3 rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;