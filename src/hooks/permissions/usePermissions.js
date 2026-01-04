import { useCallback, useEffect, useState } from "react";
import { permissionsService } from "../../services/permissions/permissionsService";

export default function usePermissions() {
  /** Permissions */
  const [permissions, setPermissions] = useState([]);

  /** Loading , Error */
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const fetchAllPermissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await permissionsService.getAllPermissions();
      console.log(data.data);

      setPermissions(data?.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Call */
  useEffect(() => {
    fetchAllPermissions();
  }, [fetchAllPermissions]);

  /** Return Array Contains Each Permissions By Group */
  const permissionsByGroupObject = permissions?.reduce((acc, current) => {
    if (!acc[current.collection_name]) {
      acc[current.collection_name] = [];
      /** { users: []} */
    }
    acc[current.collection_name].push(current);
    return acc;
  }, {});

  const permissionsByGroupArray = Object.keys(permissionsByGroupObject);

  return {
    permissions,
    permissionsByGroupArray,
    permissionsByGroupObject,
    loading,
    error,
  };
}
