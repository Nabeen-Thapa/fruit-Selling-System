import React, { useEffect, useState } from 'react';
import { ProductCard } from '../../components/products/viewProductCard';
import { useProducts } from '../../hooks/products/userProduct.hook';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';
import { useNavigate } from 'react-router-dom';
import { deleteProduct } from '../../services/product.services';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Product } from '../../types/product.type';
import { useCurrentUser } from '../../utility/currentUser.utils';

const ViewProducts: React.FC = () => {
  const { products: initialProducts, loading, error, deleteProduct } = useProducts();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const navigate = useNavigate();
  const { currentUserRole, currentUserId, loadingCurrentUser } = useCurrentUser();


  console.log("view product page:", products);
  // Update local products when initialProducts changes
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);


  const handleEdit = (id: string) => {
    navigate(`/falful/product/${id}/update`);
    // navigate(`/falful/product/${id}/edit`);
  };
  const addToCart =()=>{
    alert("addeddd")
  }


  // Remove local setProducts state and rely on hook
  const handleDelete = async (id: string) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteProduct(id); // ⬅ Use hook's delete logic
              toast.success('Product deleted successfully');
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Deletion failed');
            }
          }
        },
        { label: 'No' }
      ]
    });
    navigate("/falful/products");
  };

  const handleView = (id: string) => {
    navigate(`/falful/product/${id}/view`);
  };


  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (products.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mt-5">
        <div className="text-center mt-6 pt-2 mb-8">
          <h1 className="text-3xl mt-6 pt-6 font-bold text-gray-900">Our Products</h1>
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
              onView={handleView}
              userRole={currentUserRole}
              currentUserId={currentUserId}
              addToCart ={addToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;