import React, { useEffect, useState } from 'react';
import { usersView } from '../../types/seller.types';
import { updateSeller } from '../../services/seller.services';
import { useCurrentUser } from '../../utility/currentUser.utils';
import { UserType } from '../../types/user.types';
import { updateBuyerDetail } from '../../services/buyer.services';
import { FaTimes } from 'react-icons/fa'; // Using Font Awesome close icon from react-icons

interface UserViewModalProps {
  user: usersView | null;
  onClose: () => void;
  onSave?: (updatedUser: Partial<usersView>) => void;
  isEditMode?: boolean;
}

export const UserViewModal: React.FC<UserViewModalProps> = ({
  user,
  onClose,
  onSave,
  isEditMode = true,
}) => {
  if (!user) return null;

  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address);
  const [shippingAddress, setShippingAddress] = useState(user.shippingAddress);

  const { currentUserRole, loadingCurrentUser } = useCurrentUser();
  useEffect(() => {
    console.log("User role:", currentUserRole);
  }, [currentUserRole]);

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = async () => {
    const updatedUser: Partial<usersView> = {
      name,
      email,
      phone,
      address,
      businessName,
      shippingAddress
    };

    const updatedBuyer: Partial<usersView> = {
      name,
      email,
      phone,
      address,
      shippingAddress
    };
    if (onSave) onSave(updatedUser);
    currentUserRole === UserType.SELLER ? (
      await updateSeller(updatedUser)) :
      (await updateBuyerDetail(updatedBuyer));
    console.log("update success", currentUserRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col relative">
        {/* Close button in top right corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="border-b p-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800 pr-6">
            {isEditMode ? 'Edit Profile' : 'Seller Profile'}
          </h3>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-grow">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.name
              )}
            </div>
          </div>

          {/* Business Name */}
          {currentUserRole === UserType.SELLER && (<div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.businessName
              )}
            </div>
          </div>)}

          {currentUserRole === UserType.BUYER && (<div>
            <label className="block text-sm font-medium text-gray-500 mb-1">shippingAddress</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.shippingAddress
              )}
            </div>
          </div>)}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.email
              )}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.phone
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">address</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.address
              )}
            </div>
          </div>

          {/* Registered Date */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Registered Date</label>
            <div className="text-gray-800 font-medium">
              {formatDate(user.createdAt)}
            </div>
          </div>
        </div>

        {/* Footer - Now only has Save button if in edit mode */}
        {isEditMode && (
          <div className="border-t p-4 flex justify-between flex-shrink-0">
             <button
            onClick={onClose}
            className="px-4 py-2 border bg-green-900  border-gray-300 rounded-md text-gray-100 hover:bg-green-950 transition-colors"
          >
            Close
          </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};