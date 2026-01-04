import { useCallback, useEffect, useState } from "react";
import { clientsService } from "../../services/accounts/clientsService";

const INITIAL_FILTERS = {
  search: "",
};
export default function useClientReviews(initialPage = 1, user_id) {
  /** Client Reviews */
  const [clientReviews, setClientReviews] = useState([]);

  /** Pagination */
  const [pagination, setPagination] = useState({
    current: initialPage,
    total: 1,
  });

  /** Loading , Error */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Filters */
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  /** UseCallback */
  const fetchClientReviews = useCallback(
    async (page = pagination.current) => {
      setLoading(true);
      try {
        const { data } = await clientsService.getMyReviews(user_id, {
          search: filters.search !== null ? filters.search : undefined,
          page,
        });
        setClientReviews(data.data);

        setPagination({
          current: data.pagination.current_page,
          total: data.pagination.last_page,
        });

        console.log("USER_ID:", user_id);
        console.log(data.data);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    },
    [filters.search, user_id]
  );

  /** Exceution */
  useEffect(() => {
    if (!user_id) {
      setLoading(true);
      setError(`No Client Founded`);
      return;
    }
    fetchClientReviews(pagination.current);
  }, [fetchClientReviews, pagination.current]);

  /** visibleRows */
  const visibleRows = clientReviews.filter((cs) => {
    if (!filters.search) return true;

    const hayStack = Object.values(cs).join(" ").toLowerCase();

    return hayStack.includes(filters.search.toLowerCase());
  });

  return {
    loading,
    error,
    reviews: visibleRows,
    pagination,
    filters,
    setPage: (p) => setPagination((prev) => ({ ...prev, current: p })),
    setFilters: (cb) =>
      setFilters((prev) => ({
        ...prev,
        ...(typeof cb === "function" ? cb(prev) : cb),
      })),
  };
}
