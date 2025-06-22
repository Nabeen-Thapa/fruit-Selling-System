import React, { useEffect, useState } from 'react';
import { useBuyers } from '../../hooks/user/userBuyer.hooks';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser } from '../../services/auth.fetchCurrentUser.utils';
import { useSeller } from '../../hooks/user/useSeller.hook';
import { UserType } from '../../types/user.types';
import { FiMessageSquare, FiUser, FiMail, FiKey, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const UsersList: React.FC = () => {
  const [sellerList, setSellerList] = useState<{ id: string; name: string; email: string; role: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserLoading, setCurrentUserLoading] = useState(true);
  const [currentUserRole, setcurrentUserRole] = useState<string | null>(null);
  const { viewAllSellers } = useBuyers();
  const { viewBuyerList } = useSeller();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user?.role) {
          setcurrentUserRole(user.role);
        }
      } catch (err) {
        throw new Error("Failed to load user");
      } finally {
        setCurrentUserLoading(false);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const fetchSellersList = async () => {
      if (!currentUserRole || currentUserLoading) return;

      try {
        setLoading(true);
        const response =
          currentUserRole === UserType.BUYER
            ? await viewAllSellers()
            : await viewBuyerList();
        setSellerList(response);
      } catch (error: any) {
        console.error("Failed to fetch user data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellersList();
  }, [currentUserRole, currentUserLoading]);

  const openChat = (id: string) => {
    navigate(`/falful/user/chat/${id}`);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            {currentUserRole === UserType.BUYER ? 'sellers' : 'buyers'} Directory
          </h1>
          <p className="text-lg text-gray-600">
            Connect with registered {currentUserRole === UserType.BUYER ? 'sellers' : 'buyers'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {currentUserRole === UserType.BUYER ? 'Available Sellers' : 'Registered Buyers'}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {sellerList.length}{" "}
              {currentUserRole === UserType.BUYER
                ? sellerList.length === 1
                  ? "seller"
                  : "sellers"
                : sellerList.length === 1
                  ? "buyer"
                  : "buyers"}
            </span>

          </div>

          <ul className="divide-y divide-gray-200">
            {sellerList.length > 0 ? (
              sellerList.map((user, index) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <FiUser size={20} />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                          <span className="flex items-center">
                            <FiMail className="mr-1" size={14} />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <FiKey className="mr-1" size={14} />
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {currentUserRole ===UserType.BUYER &&<button
                        onClick={() => navigate(`/falful/products/${user.id}/products`)} // Assuming you have a route for viewing seller's products
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                      >
                        <FiShoppingBag className="mr-2" size={16} />
                        View Products
                      </button>}
                      <button
                        onClick={() => openChat(user.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <FiMessageSquare className="mr-2" size={16} />
                        Message
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              <li className="px-6 py-8 text-center">
                <div className="text-gray-400">
                  <FiUser className="mx-auto h-12 w-12" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    There are currently no {currentUserRole === UserType.BUYER ? 'sellers' : 'buyers'} registered.
                  </p>
                </div>
              </li>
            )}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default UsersList;