import { useCallback, useEffect, useState } from "react";
import { sampleCodesService } from "../../services/sampleCodesService/sampleCodesService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useSampleCodes(initialPage = 1) {
  /** sampleCodes */
  const [sampleCodes, setSampleCodes] = useState([]);

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

  /** Fetch Sample Codes */
  const fetchSampleCodes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await sampleCodesService.getAllSampleCodes({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setSampleCodes(data.data);

      setPagination({
        current: data.pagination.current_page,
        total: data.pagination.last_page,
      });
    } catch (err) {
      setError(err?.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters.sorted_by, filters.search, pagination.current]);

  /** Auto Fetch on First Load + Filters + Pagination Change */
  useEffect(() => {
    fetchSampleCodes();
  }, [fetchSampleCodes]);

  /** Fetch Sample Code */
  const fetchSampleCode = useCallback(async (sampleCodeID) => {
    try {
      const res = await sampleCodesService.getSampleCode(sampleCodeID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Sample Codes Without Pagination */
  const fetchSampleCodesWithoutPagination = useCallback(async () => {
    try {
      const res = await sampleCodesService.getAllSampleCodesWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = sampleCodes.filter((sampleCode) => {
    if (!filters.search) return true;

    const hayStack = Object.values(sampleCode).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    sampleCodes: visibleRows,
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

    /** Fetch Sample Code */
    fetchSampleCode,
    /** Manual Refetch */
    refetchSampleCodes: fetchSampleCodes,

    /** Without Pagination */
    fetchSampleCodesWithoutPagination,
    exportSheet: async (ids = []) => {
      try {
        const { data } = await sampleCodesService.exportSheet(ids);
        window.open(data.data, "_blank");
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
