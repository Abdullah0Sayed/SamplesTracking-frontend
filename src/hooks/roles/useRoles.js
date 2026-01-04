import { useCallback, useEffect, useState } from "react";
import { rolesService } from "../../services/roles/rolesService";

export default function useRoles() {
  /** roles */
  const [roles, setRoles] = useState([]);

  /** Loading , Error */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /** Search */
  const [search, setSearch] = useState("");

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await rolesService.getAllRoles();
      setRoles(data?.data);
      console.log(data.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  /** Fetch Role */
  const fetchRoleById = useCallback(async (id) => {
    try {
      const res = await rolesService.getRoleById(id);
      return res;
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Visible Rows */
  const visibleRows = roles.filter((role) => {
    if (!search) {
      return true;
    }
    const hayStack = Object.values(role).join(" ").toLowerCase();
    return hayStack.includes(search.toLowerCase());
  });
  return {
    roles: visibleRows,
    search,
    setSearch,
    loading,
    error,
    refetchRoles: fetchRoles,
    fetchRoleById,
  };
}
