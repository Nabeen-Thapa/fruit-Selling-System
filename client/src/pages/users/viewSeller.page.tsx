// ViewSellerData.tsx
import React, { useEffect, useState } from "react";
import { UserViewModal } from "../../components/user/viewUserModal";
import { useSeller } from "../../hooks/user/useSeller.hook";

interface ViewSellerDataProps {
  onClose: () => void;
}

const ViewSellerData: React.FC<ViewSellerDataProps> = ({ onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { viewSellerData, loading, error } = useSeller();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await viewSellerData();
        console.log("view seller page:", userData);
        setSelectedUser(userData.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // Handle error (show toast, etc.)
      }
    };

    fetchUserData();
  }, [viewSellerData]);

  return (
    <div className="p-8">
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {selectedUser && (
        <UserViewModal
          user={selectedUser} 
          onClose={onClose} 
        />
      )}
    </div>
  );
};

export default ViewSellerData;