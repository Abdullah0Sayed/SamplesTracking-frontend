import { useCallback, useEffect, useState } from "react";
import { storageLocationsService } from "../../services/storageLocations/storageLocationsService";

const INITIAL_FILTERS = {
  sorted_by: "all",
  search: "",
};

export default function useStorageLocations(initialPage = 1) {
  /* ========== Storage locations ========== */
  const [storageLocations, setStorageLocations] = useState([]);

  /* ========== Loading , Error ========== */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /* ========== Filter ========== */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /* ========== Pagination ========== */
  const [pagination, setPagination] = useState({
    current: initialPage,
    total: 1,
  });

  /* ========== CallBack ========== */
  const fetchStorageLocations = useCallback(async () => {
    try {
      const { data } = await storageLocationsService.getAllStorageLocation({
        sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
        search: filters.search !== null ? filters.search : undefined,
        page: pagination.current,
      });

      setStorageLocations(data?.data);
      setPagination({
        current: data?.pagination.current_page,
        total: data?.pagination.last_page,
      });
    } catch (error) {
      console.log(error);
      setError(error?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters.sorted_by, filters.search, pagination.current]);

  const fetchStorageLocation = useCallback(async (storageLocationId) => {
    try {
      const res =
        await storageLocationsService.getStorageLocation(storageLocationId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== EFFECT ========== */
  useEffect(() => {
    fetchStorageLocations();
  }, [fetchStorageLocations]);

  /* ========== Apply Local Search (client-side filter) ========== */
  const visibleRows = storageLocations.filter((storageLocation) => {
    if (!filters.search) return true;

    const hayStack = Object.values(storageLocation).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    storageLocations: visibleRows,
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

    /** Fetch Storage Location */
    fetchStorageLocation,
    /** Manual Refetch */
    refetchStorageLocations: fetchStorageLocations,

    exportSheet: async (ids = []) => {
      try {
        const { data } = await storageLocationsService.exportSheet(ids);
        window.open(data.data, "_blank");
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
