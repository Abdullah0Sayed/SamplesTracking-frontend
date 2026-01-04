import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { rolesService } from "../../services/roles/rolesService";

export default function useAuthedUserPermissions() {
  /** Fetch Authed User Permissions Based On Role ID */
  const { user, userLoading } = useSelector((state) => state.auth);

  /** Init For Permissions */

  const [permissions, setPermissions] = useState(null);
  const [permissionsLoading, setPermissionsLoading] = useState(false);

  /** Based on Loading User Fetch */

  const fetchPermissionsForAuthedUserRole = useCallback(async () => {
    setPermissionsLoading(true);
    try {
      const { data } = await rolesService.getRoleById(user?.role?.id);
      const role = data?.data;
      setPermissions(role?.permissions?.map((p) => p.name));
    } catch (error) {
      console.log(error);
    } finally {
      setPermissionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && !userLoading) {
      fetchPermissionsForAuthedUserRole();
    }
  }, [user, userLoading, fetchPermissionsForAuthedUserRole]);

  /** Return  */
  return {
    permissions,
    permissionsLoading,
  };
}
