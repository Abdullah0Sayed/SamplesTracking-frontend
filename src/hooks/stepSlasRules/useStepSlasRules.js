import { useCallback, useEffect, useState } from "react";
import { stepSlasRulesService } from "../../services/stepSlasRules/stepSlasRulesService";

const INITIAL_FILTERS = {
  sorted_by: "",
  search: "",
  department_id: "",
  test_type_id: "",
  master_step_id: "",
};
export default function useStepSlasRules(initialPage = 1) {
  /* ========== StepSlasRules ========== */
  const [stepSlasRules, setStepSlasRules] = useState([]);

  /* ========== Loading & Error ========== */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ========== Pagination ========== */
  const [pagination, setPagination] = useState({
    current_page: initialPage,
    total: 1,
  });

  /* ========== Filters ========== */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /* ========== CALLBACK ========== */
  const fetchStepSlasRules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await stepSlasRulesService.getAllStepSlasRules({
        sorted_by: filters.sorted_by !== null ? filters.sorted_by : undefined,
        search: filters.search !== null ? filters.search : undefined,
        department_id:
          filters.department_id !== null ? filters.department_id : undefined,
        test_type_id:
          filters.test_type_id !== null ? filters.test_type_id : undefined,
        master_step_id:
          filters.master_step_id !== null ? filters.master_step_id : undefined,
        page: pagination.current_page,
      });
      console.log(data?.data);
      setStepSlasRules(data?.data);
    } catch (error) {
      setError("");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [
    filters.department_id,
    filters.master_step_id,
    filters.test_type_id,
    filters.search,
    filters.sorted_by,
  ]);

  const fetchStepSlasRule = useCallback(async (stepSlasRuleId) => {
    try {
      const res = await stepSlasRulesService.getStepSlasRule(stepSlasRuleId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /* ========== EFFECTS ========== */
  useEffect(() => {
    fetchStepSlasRules();
  }, [fetchStepSlasRules]);

  /* ========== APPLY LOCAL SEARCH ========== */
  const visibleRows = stepSlasRules.filter((stepSlas) => {
    if (!filters.search) {
      return true;
    }

    const hayStack = Object.values(stepSlas).join(" ").toLowerCase();
    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    stepSlasRules: visibleRows,
    loading,
    error,
    filters,
    pagination,
    setPage: (p) => {
      setPagination((prev) => ({ ...prev, current_page: p }));
    },
    setFilters: (cb) => {
      setFilters((prev) => ({
        ...prev,
        ...(typeof cb === "function" ? cb(prev) : cb),
      }));
    },
    refetchStepSlasRules: fetchStepSlasRules,
    fetchStepSlasRule,
    exportSheet: async (ids = []) => {
      try {
        const { data } = await stepSlasRulesService.exportSheet(ids);
        window.open(data.data, "_blank");
      } catch (e) {
        console.log(e);
        alert("فشل تصدير شيت الإكسيل");
      }
    },
  };
}
