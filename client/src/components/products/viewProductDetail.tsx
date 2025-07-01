import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSpecificProduct } from '../../hooks/products/userSpecificProduct.hook';
import { StarIcon, HeartIcon, ShareIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useCart } from '../../hooks/products/useCart.hook';
import { FiShoppingBag } from 'react-icons/fi';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loadingOne, error } = useSpecificProduct(id || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);
    const { addNewItemToCart } = useCart(); 
  const navigate = useNavigate();

  if (loadingOne) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Product not found
      </div>
    </div>
  );

  const handleQuantityChange = (value: number) => {
    const newValue = quantity + value;
    if (newValue > 0 && newValue <= (product.quantity || 10)) {
      setQuantity(newValue);
    }
  };

  const backToProduct = () => {
    navigate("/falful/products");
  }

   const addToCart =(productId:string)=>{
    addNewItemToCart(productId, quantity);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-6 px-4 sm:px-6 lg:px-8">
      <button
        type="button"
        className="mt-6 ml-5 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 flex items-center shadow-md"
        onClick={backToProduct}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back
      </button>
      <div className="max-w-7xl mt-6 mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Image Gallery */}
            <div className="md:w-1/2 p-6">
              <div className="h-96 w-full mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
                  alt={product.images?.[selectedImage]?.altText || product.name}
                  className="w-full h-full object-contain transition duration-300 hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images?.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <img
                      src={img.url}
                      alt={img.altText}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="md:w-1/2 p-6 md:border-l border-gray-200">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isLiked ? (
                    <HeartIconSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-2">(24 reviews)</span>
              </div>

              <p className="text-gray-700 text-lg mb-6">{product.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">Rs. {product.price}</span>

              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="pl-4 pr-0 py-1">{quantity}</span>
                    <span className="text-gray-500 text-sm ml-2"> {product.quantityType}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm ml-2">{product.quantity} {product.quantityType} available</span>
                </div>
              </div>

              <div className="flex space-x-4 mb-6">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"  onClick={()=> addToCart(product.id)}>
                  <ShoppingCartIcon className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg transition-colors flex-grow flex items-center justify-center"
                onClick={()=>
                   navigate("/falful/product/checkout", {
                  state:{
                    product:product,
                    quantity:quantity
                  }
                })
                }
                >
                  <FiShoppingBag className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Buy Now</span>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center mb-2">
                  <span className="text-gray-700 font-medium mr-2">Seller:</span>
                  <span className="text-gray-600">
                    { product.sellers?.name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">Contact:</span>
                  <span className="text-gray-600">{product.sellers?.phone}</span>
                </div>
                 <div className="flex items-center">
                  <span className="text-gray-700 font-medium mr-2">email:</span>
                  <span className="text-gray-600">{product.sellers?.email}</span>
                </div>
              </div>


              <button className="mt-4 text-blue-600 hover:text-blue-800 flex items-center">
                <ShareIcon className="h-5 w-5 mr-2" />
                Share this product
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h2> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Info</h3>
              <ul className="space-y-2">
                <li className="flex">
                  <span className="text-gray-600 w-32">Delivery</span>
                  <span className="text-gray-900">2-3 business days</span>
                </li>
                <li className="flex">
                  <span className="text-gray-600 w-32">Returns</span>
                  <span className="text-gray-900">7 days easy return</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;