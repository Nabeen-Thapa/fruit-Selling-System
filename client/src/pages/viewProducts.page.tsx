import React, { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

interface ProductImage {
  url: string;
  altText?: string;
}

interface Product {
  id: string;
  name: string;
  price: number | string; // Allow both number and string
  description: string;
  quantity: number;
  seller: string;
  images: ProductImage[];
}

const ViewProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/product/view');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        
        // Ensure price is converted to number
        const processedProducts = data.data.map((product: Product) => ({
          ...product,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price
        }));
        
        setProducts(processedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price: number | string): string => {
    // Handle both string and number inputs
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numericPrice.toFixed(2);
  };

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (products.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse through our collection of fresh fruits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
              {product.images?.length > 0 && (
                <div className="h-48 overflow-hidden">
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
                  <span className="text-lg font-bold text-green-600">
                    RS.{formatPrice(product.price)}
                  </span>
                </div>
                <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Seller: {product.seller}</span>
                   <span className="text-sm text-gray-500">contact: {product.phone}</span>
                  <span className="text-sm text-gray-500">Qty: {product.quantity}</span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button 
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => console.log('Edit', product.id)}
                  >
                    <FiEdit className="inline mr-1" /> Edit
                  </button>
                  <button 
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => console.log('Delete', product.id)}
                  >
                    <FiTrash2 className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;