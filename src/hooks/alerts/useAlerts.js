import { useCallback, useEffect, useState } from "react";
import { authService } from "../../services/auth/authService";

export default function useAlerts(user) {
  const [filters, setFilters] = useState({
    user_id: null,
    user_type: "admin",
  });

  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (user) {
      setFilters({
        user_id: user.id,
        user_type: "admin",
      });
    }
  }, [user]);

  const fetchAlerts = useCallback(async () => {
    try {
      const { data } = await authService.getMyAlerts(filters);
      setAlerts(data?.data || []);
    } catch (error) {
      console.error(error);
    }
  }, [filters]);

  useEffect(() => {
    if (filters.user_id) {
      fetchAlerts();
    }
  }, [fetchAlerts, filters.user_id]);

  return {
    alerts,
    filters,
    fetchAlerts,
  };
}
