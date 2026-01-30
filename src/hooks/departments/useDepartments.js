import { useCallback, useEffect, useState } from "react";
import { departmentsService } from "../../services/departments/departmentsService";

const INITIAL_FILTERS = {
  sorted_by: "all",
  search: "",
};

export default function useDepartments(initialPage = 1) {
  /* ========== Departments ========== */
  const [departments, setDepartments] = useState([]);

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
  const fetchDepartments = useCallback(async () => {
    try {
      const { data } = await departmentsService.getAllDepartments({
        sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
        search: filters.search !== null ? filters.search : undefined,
        page: pagination.current,
      });

      setDepartments(data?.data);
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

  const fetchDepartment = useCallback(async (departmentId) => {
    try {
      const res = await departmentsService.getDepartment(departmentId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== EFFECT ========== */
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  /* ========== Fetch Departments Without Pagination ========== */
  const fetchDepartmentsWithoutPagination = useCallback(async () => {
    try {
      const res = await departmentsService.getAllDepartmentsWithoutPagination();
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== Apply Local Search (client-side filter) ========== */
  const visibleRows = departments.filter((department) => {
    if (!filters.search) return true;

    const hayStack = Object.values(department).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    departments: visibleRows,
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

    /** Fetch Department */
    fetchDepartment,
    /** Fetch Without Pagination */
    fetchDepartmentsWithoutPagination,
    /** Manual Refetch */
    refetchDepartments: fetchDepartments,

    exportSheet: async (ids = []) => {
      try {
        const { data } = await departmentsService.exportSheet(ids);
        // window.open(data.data, "_blank");
        if (data.status && data.data) {
          window.open(data.data, "_blank"); // يفتح الملف في تبويب جديد
        }
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
