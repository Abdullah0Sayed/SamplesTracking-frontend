import { useCallback, useEffect, useState } from "react";
import { clientsService } from "../../services/accounts/clientsService";

const INITIAL_FILTERS = {
  sorted_by: "all",
  is_active: undefined,
  search: "",
};

export default function useClients(inital_page = 1) {
  /** Clients List */
  const [clients, setClients] = useState([]);

  /** Stats */
  const [clientsStats, setClientsStats] = useState({});

  /** loading & errors */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** pagination */
  const [pagination, setPagination] = useState({
    current: inital_page,
    total: 1,
  });

  /** Filters */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /** Fetch Clients */
  const fetchClients = useCallback(
    async (page = pagination.current) => {
      setLoading(true);
      try {
        const { data } = await clientsService.getAllClients({
          sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
          search: filters.search !== null ? filters.search : undefined,
          is_active: filters.is_active !== null ? filters.is_active : undefined,
          page,
        });

        setClients(data.data);
        setClientsStats(data.stats);
        console.log(data.stats);
        setPagination({
          current: data.pagination.current_page,
          total: data.pagination.last_page,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [filters.search, filters.sorted_by, filters.is_active]
  );

  /** Fetch Client */
  const fetchClient = useCallback(async (clientId) => {
    try {
      const res = await clientsService.getClient(clientId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Call Fetch */
  useEffect(() => {
    fetchClients(pagination.current);
  }, [fetchClients, pagination.current]);

  /** Apply Search */
  const visiableRows = clients.filter((client) => {
    if (!filters.search) return true;
    const hayStack = Object.values(client).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    clients: visiableRows,
    stats: clientsStats,
    loading,
    error,
    filters,
    refetchClients: fetchClients,
    pagination,
    fetchClient,
    setPage: (p) => setPagination((prev) => ({ ...prev, current: p })),
    setFilters: (cb) =>
      setFilters((prev) => ({
        ...prev,
        ...(typeof cb === "function" ? cb(prev) : cb),
      })),
  };
}
