import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/auth.fetchCurrentUser.utils';

export const useCurrentUser = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loadingCurrentUser, setloadingCurrentUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user?.role && user?.userId) {
          setCurrentUserRole(user.role);
          setCurrentUserId(user.userId);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setloadingCurrentUser(false);
      }
    };
    loadUser();
  }, []);

  return { currentUserRole, loadingCurrentUser,currentUserId };
};
