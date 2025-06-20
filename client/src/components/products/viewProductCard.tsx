import React from 'react';
import { FiEdit, FiEye, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Product } from '../../types/product.type';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { UserType } from '../../types/user.types';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  userRole: string | null;
  currentUserId: string | null;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
  userRole,
  currentUserId,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] flex flex-col h-full">
      {product.images?.length > 0 && (
        <div className="h-60 overflow-hidden">
          <img
            src={product.images[0].url}
            alt={product.images[0].altText || product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
          <div className="whitespace-nowrap">
            <span className="text-lg font-bold text-green-600">
              Rs. {Number(product.price).toFixed(0)}/{product.quantityType}
            </span>
            {/* <span className="text-sm text-gray-500"></span> */}
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <span>Seller: {product.seller?.name}</span>
          <span>Contact: {product.seller?.phone}</span>
          <span>Qty: {product.quantity}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 justify-between">
          <button
            className={`px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center ${userRole === UserType.SELLER && currentUserId !== product.seller.id
                ? "w-full"  // Full width if seller is not the owner
                : "flex-1 min-w-[80px]"  // Default behavior otherwise
              }`}
            onClick={() => onView(product.id)}
          >
            <FiEye className="inline mr-1" /> View
          </button>

          {userRole === UserType.BUYER && (
            <>
              <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex-grow flex items-center justify-center">
                <ShoppingCartIcon className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Add to Cart</span>
              </button>
              <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex-grow flex items-center justify-center">
                <FiShoppingBag className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Buy Now</span>
              </button>
            </>
          )}

          {userRole === UserType.SELLER && currentUserId === product.seller.id && (
            <>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors  flex-1 min-w-[50px] flex items-center justify-center"
                onClick={() => onEdit(product.id)}
              >
                <FiEdit className="inline mr-1" /> Edit
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex-1 min-w-[50px] flex items-center justify-center"
                onClick={() => onDelete(product.id)}
              >
                <FiTrash2 className="inline mr-1" /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};