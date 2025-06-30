import React from 'react';
import { FiArrowLeft, FiCreditCard, FiHome, FiMapPin, FiPackage, FiTruck } from "react-icons/fi";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  // Sample data - replace with your actual state management
  const cartItems = [
    {
      id: "1",
      product: {
        name: "Organic Apples",
        images: [{ url: "https://via.placeholder.com/150" }],
        quantityType: "kg"
      },
      price: "2.50",
      quantity: 2,
      totalPrice: "5.00"
    },
    {
      id: "2",
      product: {
        name: "Fresh Milk",
        images: [{ url: "https://via.placeholder.com/150" }],
        quantityType: "liter"
      },
      price: "1.20",
      quantity: 1,
      totalPrice: "1.20"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
  const shipping = 2.50;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
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
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
              </div>
              
              <div className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
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
                    Credit card
                  </label>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                        Card number
                      </label>
                      <input
                        type="text"
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on card
                      </label>
                      <input
                        type="text"
                        id="card-name"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration date (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiration-date"
                        placeholder="MM/YY"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        id="cvc"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
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
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                        <p className="text-xs text-gray-500">
                          {item.quantity} {item.product.quantityType} × NRS {parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">NRS {parseFloat(item.totalPrice).toFixed(2)}</span>
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
};

export default CheckoutPage;