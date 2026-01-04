import { useCallback, useEffect, useState } from "react";
import { testCodesService } from "../../services/testCodesService/testCodesService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useTestCodes(initialPage = 1) {
  /** testCodes */
  const [testCodes, setTestCodes] = useState([]);

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

  /** Fetch Test Codes */
  const fetchTestCodes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await testCodesService.getAllTestCodes({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setTestCodes(data.data);

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
    fetchTestCodes();
  }, [fetchTestCodes]);

  /** Fetch Test Code */
  const fetchTestCode = useCallback(async (testCodeID) => {
    try {
      const res = await testCodesService.getTestCode(testCodeID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Test Codes Without Pagination */
  const fetchTestCodesWithoutPagination = useCallback(async () => {
    try {
      const res = await testCodesService.getAllTestCodesWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = testCodes.filter((testCode) => {
    if (!filters.search) return true;

    const hayStack = Object.values(testCode).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    testCodes: visibleRows,
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

    /** Fetch Test Code */
    fetchTestCode,
    /** Manual Refetch */
    refetchTestCodes: fetchTestCodes,

    /** Without Pagination */
    fetchTestCodesWithoutPagination,
  };
}
