import { useCallback, useEffect, useState } from "react";
import { refrigeratorService } from "../../services/refrigerators/refrigeratorService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useRefrigerators(initialPage = 1) {
  /** refrigerators */
  const [refrigerators, setRefrigerators] = useState([]);

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

  /** Fetch Refrigerators */
  const fetchRefrigerators = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await refrigeratorService.getRefrigeratorList({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setRefrigerators(data.data);

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
    fetchRefrigerators();
  }, [fetchRefrigerators]);

  /** Fetch Refrigerator */
  const fetchRefrigerator = useCallback(async (refrigeratorID) => {
    try {
      const res = await refrigeratorService.getRefrigeratorById(refrigeratorID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Refrigerators Without Pagination */
  const fetchRefrigeratorsWithoutPagination = useCallback(async () => {
    try {
      const res =
        await refrigeratorService.getRefrigeratorListWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);
  /** Apply Local Search (client-side filter) */
  const visibleRows = refrigerators.filter((refrigerator) => {
    if (!filters.search) return true;

    const hayStack = Object.values(refrigerator).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    refrigerators: visibleRows,
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

    /** Fetch refrigerator */
    fetchRefrigerator,
    /** Manual Refetch */
    refetchRefrigerators: fetchRefrigerators,
    /** Without Pagination */
    fetchRefrigeratorsWithoutPagination,
  };
}
