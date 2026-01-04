import { useCallback, useEffect, useState } from "react";
import { freezerService } from "../../services/freezers/freezerService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useFreezers(initialPage = 1) {
  /** freezers */
  const [freezers, setFreezers] = useState([]);

  /** Pagination */
  const [pagination, setPagination] = useState({
    current: initialPage,
    total: 1,
  });

  /** filters */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /** Loading & Errors */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Fetch Freezers */
  const fetchFreezers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await freezerService.getFreezersList({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setFreezers(data.data);

      setPagination({
        current: data.pagination.current_page,
        total: data.pagination.last_page,
      });
    } catch (err) {
      console.log(err);
      setError(err?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters.sorted_by, filters.search, pagination.current]);

  /** Auto Fetch on First Load + Filters + Pagination Change */
  useEffect(() => {
    fetchFreezers();
  }, [fetchFreezers]);

  /** Fetch Freezer */
  const fetchFreezer = useCallback(async (freezerID) => {
    try {
      const res = await freezerService.getFreezerById(freezerID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Freezers Without Pagination */
  const fetchFreezersWithoutPagination = useCallback(async () => {
    try {
      const res = await freezerService.getFreezersListWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = freezers.filter((freezer) => {
    if (!filters.search) return true;

    const hayStack = Object.values(freezer).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    freezers: visibleRows,
    loading,
    error,
    pagination,

    filters,
    setFilters: (cb) => {
      setFilters((prev) => ({
        ...prev,
        ...(typeof cb === "function" ? cb(prev) : cb),
      }));
    },

    /** Change page and auto trigger reload */
    setPage: (page) => {
      setPagination((prev) => ({ ...prev, current: page }));
    },

    /** Fetch freezer */
    fetchFreezer,
    /** Manual Refetch */
    refetchFreezers: fetchFreezers,

    /** Without Pagination */
    fetchFreezersWithoutPagination,
  };
}
