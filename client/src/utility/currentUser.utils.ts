// hooks/useCurrentUser.ts
import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/auth.fetchCurrentUser.utils';

export const useCurrentUser = () => {
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [loadingCurrentUser, setloadingCurrentUser] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await fetchCurrentUser();
        if (user?.role) {
          setCurrentUserRole(user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setloadingCurrentUser(false);
      }
    };
    loadUser();
  }, []);

  return { currentUserRole, loadingCurrentUser };
};
