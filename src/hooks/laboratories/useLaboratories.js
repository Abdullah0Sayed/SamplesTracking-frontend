import { useCallback, useEffect, useState } from "react";
import { sampleCodesService } from "../../services/sampleCodesService/sampleCodesService";
import { laboratoryService } from "../../services/laboratory/laboratoryService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
};

export default function useLaboratories(initialPage = 1) {
  /** laboratories */
  const [laboratories, setLaboratories] = useState([]);

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

  /** Fetch Laboratories */
  const fetchLaboratories = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await laboratoryService.getLaboratoriesList({
        sorted_by: filters.sorted_by || undefined,
        search: filters.search || undefined,
        page: pagination.current,
      });

      console.log(data.data);
      setLaboratories(data.data);

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
    fetchLaboratories();
  }, [fetchLaboratories]);

  /** Fetch Laboratory */
  const fetchLaboratory = useCallback(async (laboratoryID) => {
    try {
      const res = await laboratoryService.getLaboratoryByID(laboratoryID);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Fetch Laboratories Without Pagination */
  const fetchLaboratoriesWithoutPagination = useCallback(async () => {
    try {
      const res = await laboratoryService.getAllLaboratoriesWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Apply Local Search (client-side filter) */
  const visibleRows = laboratories.filter((laboratory) => {
    if (!filters.search) return true;

    const hayStack = Object.values(laboratory).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    laboratories: visibleRows,
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

    /** Fetch Laboratory */
    fetchLaboratory,
    /** Manual Refetch */
    refetchLaboratories: fetchLaboratories,

    /** Without Pagination */
    fetchLaboratoriesWithoutPagination,
  };
}
