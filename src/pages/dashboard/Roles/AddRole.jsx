import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BreedCrump from "../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import usePermissions from "../../../hooks/permissions/usePermissions";
import { useForm } from "react-hook-form";
import { BiChevronDown, BiInfoCircle, BiPlus } from "react-icons/bi";
import { rolesService } from "../../../services/roles/rolesService";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const AddRole = () => {
  const { t } = useTranslation("global");
  const {
    permissions,
    loading,
    error,
    permissionsByGroupObject,
    permissionsByGroupArray,
  } = usePermissions();

  const navigate = useNavigate();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openGroups, setOpenGroups] = useState([]);

  const toggleGroup = (index) => {
    setOpenGroups((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const { state } = useLocation();

  const roleId = state?.id;

  const [role, setRole] = useState({});

  const fetchRoleById = useCallback(async (roleId) => {
    try {
      const { data } = await rolesService.getRoleById(roleId);
      setRole(data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (roleId) {
      fetchRoleById(roleId);
    }
  }, [roleId, fetchRoleById]);

  /** Form */
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  /** كل الـ IDs للـ Permissions */
  const allPermissionsIds = permissions?.map((p) => p.id) ?? [];

  /** Select All */
  const toggleAll = () => {
    if (selectedRows?.length === allPermissionsIds?.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allPermissionsIds);
    }
  };

  /** Toggle One */
  const toggleOne = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  /** Sync form with selectedRows */
  useEffect(() => {
    setValue("permissions", selectedRows);
  }, [selectedRows, setValue]);

  useEffect(() => {
    if (role) {
      setValue("name", role.name || "");
      // select permissions
      const selected = role?.permissions?.map((p) => p.id) ?? [];
      setSelectedRows(selected);
    }
  }, [role, setValue]);

  const onsubmit = async (data) => {
    try {
      if (roleId) {
        const res = await rolesService.updateRole(data, roleId);
        toast.success(t("accountsManagement.roles.updateRoleStatusSuccess"));

        navigate(-1);
      } else {
        const res = await rolesService.addRole({
          ...data,
          name: data?.name?.toLowerCase(),
        });
        toast.success(t("accountsManagement.roles.addRoleStatusSuccess"));

        navigate(-1);
      }
      console.log("SUBMITTED:", data);
    } catch (error) {
      toast.error(t("global.errorProcessingRequest"));
      console.log(error);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <BreedCrump breed_title={t("accountsManagement.roles.addRole")} />

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onsubmit)}>
        {/* ===== Basic Data Card ===== */}
        <div className="w-full bg-white p-4 grid grid-cols-2 gap-4 rounded-2xl">
          {/* Select All + Submit */}
          <div className="col-span-2 flex justify-between items-center">
            {/* SELECT ALL */}
            <label
              htmlFor="check-all"
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                id="check-all"
                checked={
                  allPermissionsIds !== null &&
                  selectedRows.length === allPermissionsIds.length
                }
                onChange={toggleAll}
                className="peer appearance-none h-5 w-5 rounded-md border border-gray-400 cursor-pointer 
                                           checked:bg-primary-color checked:border-primary-color checked:ring-2 ring-primary-color/20"
              />
              <span
                className="absolute h-5 w-5 pointer-events-none flex items-center justify-center text-white 
                                            peer-checked:before:content-['✓']"
              ></span>
              <span>{t("global.selectAll")}</span>
            </label>

            {/* SUBMIT */}
            <button
              className="hover:scale-95 transition bg-primary-color rounded-xl text-white px-4 py-2 flex items-center justify-center gap-1"
              type="submit"
              disabled={isSubmitting}
            >
              {t("global.save")}
            </button>
          </div>

          <hr className="col-span-2 w-full h-[0.5px] bg-black/10 rounded-full" />

          {/* Name */}
          <div className="col-span-2 flex flex-col gap-2">
            <label>{t("accountsManagement.roles.rolesFields.name")}</label>
            <input
              {...register("name", {
                validate: (value) =>
                  /^[^\u0600-\u06FF]*$/.test(value) ||
                  `غير مسموح بالحروف العربية`,
                onChange: (e) =>
                  (e.target.value = e.target.value.replace(
                    /[\u0600-\u06FF]/g,
                    "",
                  )),
              })}
              className="border rounded-md px-4 py-2"
              placeholder={t(
                "accountsManagement.roles.rolesFields.namePlaceHolder",
              )}
            />
            <p
              className={`text-sm text-black/20 font-semibold flex items-center gap-1`}
            >
              {" "}
              <BiInfoCircle />{" "}
              {t("accountsManagement.roles.rolesFields.acceptOnlyEnLetters")}
            </p>
            {errors["name"] && (
              <p
                className={`text-sm text-red-300 font-semibold flex items-center gap-1`}
              >
                {" "}
                <BiInfoCircle /> {errors["name"].message}{" "}
              </p>
            )}
          </div>
        </div>

        {/* ===== PERMISSIONS GROUPS ===== */}
        {loading ? (
          <p>{t("global.loadingData")}</p>
        ) : error ? (
          <p>{t("global.errorInLoadingData")}</p>
        ) : permissions.length === 0 ? (
          <p>{t("global.noDataFounded")}</p>
        ) : (
          permissionsByGroupArray.map((collection_name, index) => (
            <div
              key={index}
              className="w-full flex flex-col gap-4 rounded-2xl bg-white p-4"
            >
              <div
                className={`flex cursor-pointer flex-row justify-between items-center`}
                onClick={() => toggleGroup(index)}
              >
                <p className="text-2xl font-semibold">{collection_name}</p>
                <motion.div
                  animate={{ rotate: openGroups.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <BiChevronDown className="text-xl" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openGroups.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="overflow-hidden cursor-pointer flex flex-wrap gap-4"
                  >
                    {permissionsByGroupObject[collection_name].map(
                      (permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          {/* Visual Checkbox (controlled) */}
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(permission.id)}
                            onChange={() => toggleOne(permission.id)}
                            className="peer appearance-none h-5 w-5 rounded-md border border-gray-400 cursor-pointer
                                                       checked:bg-primary-color checked:border-primary-color checked:ring-2 ring-primary-color/20"
                          />

                          <span
                            className="absolute h-5 w-5 text-xs pointer-events-none flex items-center justify-center text-white 
                                                        peer-checked:before:content-['✓']"
                          ></span>

                          {/* Permission Name */}
                          <span>{permission.name.split(".").pop()}</span>
                        </label>
                      ),
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </form>
    </div>
  );
};

export default AddRole;
