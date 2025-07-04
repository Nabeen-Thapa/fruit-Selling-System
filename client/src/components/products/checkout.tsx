import React, { useEffect, useState } from 'react'
import { FiArrowLeft, FiCreditCard, FiHome, FiMapPin, FiPackage, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useCurrentUser } from '../../utility/currentUser.utils';
import { UserType } from '../../types/user.types';
import { useBuyers } from '../../hooks/user/userBuyer.hooks';

const Checkout = ({ cartItems, viewMyCartItems, loading }) => {
  const { viewBuyerData } = useBuyers();
  const { currentUserId, currentUserRole } = useCurrentUser(); // get userId and role
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phone: '',
    shippingAddress: '',
    email: '',
  });

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await viewBuyerData();
        console.log("Buyer Data: ", res); // 🔍 Logs the full response

        const buyer = res.data; // ✅ Extract actual buyer object

        setUserData({
          name: buyer.name || '',
          address: buyer.address || '',
          phone: buyer.phone || '',
          shippingAddress: buyer.shippingAddress || '',
          email: buyer.email,
        });
      } catch (error) {
        console.error("Error fetching buyer data:", error);
      }
    };

    if (currentUserId) fetchUserDetail();
  }, [currentUserId, currentUserRole]);

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice as string), 0);
  const shipping = 2.50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto mt-12 pt-6 px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/falful/products" className="flex items-center mt-12 text-blue-600 hover:text-blue-800">
            <FiArrowLeft className="mr-2" />
            <span className="font-medium">Back to shop</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Left column - Customer information */}
          <div className="space-y-8">
            {/* Shipping address */}
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FiMapPin className="text-blue-600 h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Shipping Address</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-gray-500">Name:</p>
                  <p className="text-gray-900">{userData.name || 'Not provided'}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900 mt-1">{userData.email || 'Not provided'}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-gray-500">Phone number</p>
                  <p className="text-gray-900 mt-1">{userData.phone || 'Not provided'}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-gray-500"> Shipping Address</p>
                  <p className="text-gray-900 mt-1">{userData.address || 'Not provided'}</p>
                </div>

              </div>

              {/* Optional edit button if you want to allow editing */}
              {/* <button
                onClick={() => setEditMode(true)} // Assuming you have an edit mode state
                className="mt-6 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Edit Shipping Address
              </button> */}
            </section>

            {/* Payment method */}
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FiCreditCard className="text-blue-600 h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Payment Method</h2>
              </div>

              <div className="space-y-4">

                <div className="flex items-center">
                  <input
                    id="credit-card"
                    name="payment-method"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                    online
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="credit-card"
                    name="payment-method"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"

                  />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit card
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="cash-on-delivery"
                    name="payment-method"
                    type="radio"
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="cash-on-delivery" className="ml-3 block text-sm font-medium text-gray-700">
                    Cash on Delivery
                  </label>
                </div>
              </div>
            </section>

            {/* Delivery method */}
            <section className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FiTruck className="text-blue-600 h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Delivery Method</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer">
                  <div className="flex items-center">
                    <input
                      id="standard-delivery"
                      name="delivery-method"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      defaultChecked
                    />
                    <div className="ml-3">
                      <label htmlFor="standard-delivery" className="block text-sm font-medium text-gray-700">
                        Standard Delivery
                      </label>
                      <p className="text-xs text-gray-500">3-5 business days</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">NRS {shipping.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer">
                  <div className="flex items-center">
                    <input
                      id="express-delivery"
                      name="delivery-method"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <label htmlFor="express-delivery" className="block text-sm font-medium text-gray-700">
                        Express Delivery
                      </label>
                      <p className="text-xs text-gray-500">1-2 business days</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">NRS {(shipping * 2).toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right column - Order summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <FiPackage className="text-blue-600 h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-lg border border-gray-200 overflow-hidden mr-4">
                        <img
                          src={
                            item.product?.images?.[0]?.url
                          }
                          alt={item.product?.name || "Product"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">
                          {item.quantity} {item.product.quantityType} × NRS {parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">NRS {parseFloat(item.totalPrice as string).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">NRS {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium text-gray-900">NRS {shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax (10%)</span>
                  <span className="text-sm font-medium text-gray-900">NRS {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-gray-900">NRS {total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full mt-6 rounded-lg bg-blue-600 px-6 py-3 text-base font-bold text-white hover:bg-blue-700 transition-colors shadow-sm">
                Place Order
              </button>

              <p className="mt-4 text-xs text-gray-500 text-center">
                By placing your order, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            {/* Return policy */}
            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <FiHome className="text-blue-600 h-5 w-5 mr-3" />
                <h3 className="text-sm font-medium text-gray-900">Return Policy</h3>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                If you're not completely satisfied with your purchase, we offer a 30-day return policy. Items must be in their original condition.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout
