import { useCallback, useEffect, useState } from "react";
import { sampleService } from "../../services/samples/sampleService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useSamples(initialPage = 1) {
  /** samples */
  const [samples, setSamples] = useState([]);

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

  /** Fetch Samples */
  const fetchSamples = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await sampleService.getAllSamples({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setSamples(data.data);

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
    fetchSamples();
  }, [fetchSamples]);

  /** Fetch Sample  */
  const fetchSample = useCallback(async (sampleID) => {
    try {
      const res = await sampleService.getSample(sampleID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Samples Without Pagination */
  const fetchSamplesWithoutPagination = useCallback(async () => {
    try {
      const res = await sampleService.getAllSamplesWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = samples.filter((sample) => {
    if (!filters.search) return true;

    const hayStack = Object.values(sample).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    samples: visibleRows,
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

    /** Fetch Sample */
    fetchSample,
    /** Manual Refetch */
    refetchSamples: fetchSamples,

    /** Without Pagination */
    fetchSamplesWithoutPagination,
  };
}
