import { useCallback, useEffect, useState } from "react";
import { testCodesService } from "../../services/testCodesService/testCodesService";
import { workflowService } from "../../services/workflows/workflowService";
import { bioBankingService } from "../../services/bioBanking/bioBankingService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
  item_type: "",
  sample_id: "",
};

export default function useBioBanking(initialPage = 1) {
  /** bioBanking */
  const [bioBanking, setBioBanking] = useState([]);

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

  /** Fetch BioBanking */
  const fetchBioBankingResults = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await bioBankingService.getAllBioBanking({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        item_type: filters.item_type || undefined,
        sample_id: filters.sample_id || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setBioBanking(data.data);

      setPagination({
        current: data.pagination.current_page,
        total: data.pagination.last_page,
      });
    } catch (err) {
      setError(err?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [
    filters.sorted_by,
    filters.search,
    filters.sample_id,
    filters.item_type,
    pagination.current,
  ]);

  /** Auto Fetch on First Load + Filters + Pagination Change */
  useEffect(() => {
    fetchBioBankingResults();
  }, [fetchBioBankingResults]);

  /** Fetch BioBanking */
  const fetchBioBanking = useCallback(async (bioBankingID) => {
    try {
      const res = await bioBankingService.getBioBanking(bioBankingID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = bioBanking.filter((biB) => {
    if (!filters.search) return true;

    const hayStack = Object.values(biB).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    bioBankingResults: visibleRows,
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

    /** Fetch BioBanking */
    fetchBioBanking,
    /** Manual Refetch */
    refetchBioBankingResults: fetchBioBankingResults,

    exportSheet: async (ids = []) => {
      try {
        const { data } = await bioBankingService.exportSheet(ids);
        window.open(data.data, "_blank");
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
