import React, { useEffect, useState } from 'react';
import { useBuyers } from '../../hooks/user/userBuyer.hooks';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { FaRegCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SellerList: React.FC = () => {
  const [sellerList, setSellerList] = useState<{ id: string; name: string; email: string; }[]>([]); const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { viewAllSellers } = useBuyers();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellersList = async () => {
      try {
        setLoading(true);
        const response = await viewAllSellers();
        console.log("page:", response)
        setSellerList(response);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSellersList();
  }, []);
  const openChat = (id: string) => {
    navigate(`/falful/user/chat/${id}`);
  }

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mt-5 mx-auto">
        <div className="text-center mt-5 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Directory</h1>
          <p className="mt-2 text-lg text-gray-600">List of all registered sellers</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="mt-6 text-center text-xl text-gray-500">
            <p>Showing {sellerList.length} sellers</p>
          </div>
          <hr />
          <ul className="divide-y divide-gray-200">
            {sellerList.length > 0 ? (
              sellerList.map((user) => (
                <li key={user.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button type="submit" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        onClick={() => openChat(user.id)}>
                        <FaRegCommentDots size={24} color="blue" />
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-6 py-4 text-center text-gray-500">
                No sellers found
              </li>
            )}
          </ul>
        </div>


      </div>
    </div>
  );
};

export default SellerList;