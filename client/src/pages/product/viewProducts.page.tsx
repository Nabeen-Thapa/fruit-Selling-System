import React from 'react';
import { ProductCard } from '../../components/products/viewProductCard';
import { useProducts } from '../../hooks/userProduct.hook';
const ViewProducts: React.FC = () => {
  const { products, loading, error } = useProducts();

  const handleEdit = (id: string) => {
    console.log('Edit', id);
    // Implement edit logic
  };

  const handleDelete = (id: string) => {
    console.log('Delete', id);
    // Implement delete logic
  };

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (products.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-2 text-sm text-gray-600">
            Browse through our collection of fresh fruits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;