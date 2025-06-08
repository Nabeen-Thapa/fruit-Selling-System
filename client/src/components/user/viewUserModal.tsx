// UserViewModal.tsx
import React from 'react';

interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string | Date;
  lastLogin: string | Date | null;
  role: string;
  businessName: string;
}

interface UserViewModalProps {
  user: Seller | null;
  onClose: () => void;
  onSave?: () => void; // Add onSave prop for save functionality
  isEditMode?: boolean; // Add flag for edit mode
}

export const UserViewModal: React.FC<UserViewModalProps> = ({ 
  user, 
  onClose, 
  onSave, 
  isEditMode = false 
}) => {
  if (!user) return null;

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="border-b p-4">
          <h3 className="text-xl font-bold text-gray-800">
            {isEditMode ? 'Edit Profile' : 'Seller Profile'}
          </h3>
        </div>
        
        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Name Section */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="text"
                  defaultValue={user.name}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.name
              )}
            </div>
          </div>

          {/* Business Name Section */}
          {user.businessName && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Business Name</label>
              <div className="text-gray-800 font-medium">
                {isEditMode ? (
                  <input
                    type="text"
                    defaultValue={user.businessName}
                    className="w-full p-2 border rounded-md"
                  />
                ) : (
                  user.businessName
                )}
              </div>
            </div>
          )}

          {/* Email Section */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="email"
                  defaultValue={user.email}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.email
              )}
            </div>
          </div>

          {/* Phone Section */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
            <div className="text-gray-800 font-medium">
              {isEditMode ? (
                <input
                  type="tel"
                  defaultValue={user.phone}
                  className="w-full p-2 border rounded-md"
                />
              ) : (
                user.phone
              )}
            </div>
          </div>

          {/* Registration Date Section */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Registered Date</label>
            <div className="text-gray-800 font-medium">
              {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="border-t p-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {isEditMode && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};