import React from 'react';
import { FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import { Product } from '../../types/product.type';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { loginUserType, UserType } from '../../types/user.types';

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  userRole: string | null;
}


export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onView,
  userRole
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
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
    <div className="p-4">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
        <div className="whitespace-nowrap">
          <span className="text-lg font-bold text-green-600">
            RS.{Number(product.price).toFixed(0)}
          </span>
          <span className="text-sm text-gray-500"> (per kg/dozen)</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">Seller: {product.seller}</span>
        <span className="text-sm text-gray-500">Contact: {product.phone}</span>
        <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
      </div>
      <div className="mt-6 flex space-x-2">
        <button
          className={`px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors `} onClick={() => onView(product.id)}>
          <FiEye className="inline mr-1" /> view details
        </button>
        {userRole === UserType.BUYER &&
        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded transition-colors flex items-center justify-center">
          <ShoppingCartIcon className="h-7 w-7 mr-2" />
          Add to Cart
        </button>}
        {userRole !== UserType.BUYER && (
          <>
            {console.log(`${loginUserType.SELLER} matched! Showing buttons.`)}
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={() => onEdit(product.id)}>
              <FiEdit className="inline mr-1" /> Edit
            </button>

            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              onClick={() => onDelete(product.id)}>
              <FiTrash2 className="inline mr-1" /> Delete
            </button>
          </>
        )}

      </div>
    </div>
  </div>
);