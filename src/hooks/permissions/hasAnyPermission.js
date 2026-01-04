/**
 * Permissions of user -> ["users.create" , "users.edit" , "services.create"]
 * Required Permissions -> ["services.edit" , "services.delete" , "cities.create"]
 * Two Direction Lead to The Same Results
 *
 */

const hasAnyPermission = (
  permissions = [],
  requiredPermissions = [],
  defaultRole = "super admin"
) => {
  return defaultRole?.toLowerCase() === "super admin"
    ? true
    : requiredPermissions?.some((p) =>
        permissions?.map((p) => p.name)?.includes(p)
      );
};

export default hasAnyPermission;
