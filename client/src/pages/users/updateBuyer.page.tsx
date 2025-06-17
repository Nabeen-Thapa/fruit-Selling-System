// ViewSellerData.tsx
import React, { useEffect, useState } from "react";
import { UserViewModal } from "../../components/user/viewUserModal";
import { useBuyers } from "../../hooks/user/userBuyer.hooks";

interface ViewSellerDataProps {
  onClose: () => void;
}

const UpdateBuyerData: React.FC<ViewSellerDataProps> = ({ onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const { viewBuyerData, loading, error } = useBuyers();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await viewBuyerData();
        console.log("view seller page:", userData);
        setSelectedUser(userData.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        // Handle error (show toast, etc.)
      }
    };

    fetchUserData();
  }, [viewBuyerData]);

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

export default UpdateBuyerData;