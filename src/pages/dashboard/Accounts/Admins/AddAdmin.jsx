import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useNavigate } from "react-router-dom";
import useRoles from "../../../../hooks/roles/useRoles";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { adminsService } from "../../../../services/accounts/adminsService";
import useDepartments from "../../../../hooks/departments/useDepartments";

const AddAdmin = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();

  //   const [rolesOptions, setRolesOptions] = useState([]);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const { roles } = useRoles();
  const { fetchDepartmentsWithoutPagination } = useDepartments();
  /** Load roles list */
  const rolesOptions = useMemo(() => {
    return (
      roles?.map((role) => ({
        value: role.id,
        label: role.name,
      })) || []
    );
  }, [roles]);

  /** Load departments list */
  const loadDepartments = useMemo(async () => {
    try {
      const { data } = await fetchDepartmentsWithoutPagination();
      setDepartmentsOptions(
        data?.data?.map((department) => ({
          value: department.id,
          label: department.department_code,
        })) || [],
      );
    } catch (error) {
      console.log(error);
    }
  }, [fetchDepartmentsWithoutPagination]);

  /** Form Fields */
  const FIELDS = useMemo(
    () => [
      {
        name: "name",
        type: "text",
        placeholder: t("accountsManagement.adminFields.namePlaceHolder"),
        label: t("accountsManagement.adminFields.name"),
        validation: {
          required: "اسم المشرف مطلوب",
        },
      },
      {
        name: "phone",
        type: "text",
        placeholder: t("accountsManagement.adminFields.phonePlaceHolder"),
        label: t("accountsManagement.adminFields.phone"),
        validation: {
          required: "رقم الهاتف مطلوب",
          pattern: {
            value: /^966\d{9}$/,
            message: "رقم الهاتف يجب أن يبدأ بـ 966 ويتبعه 9 أرقام",
          },
        },
      },
      {
        name: "password",
        type: "password",
        placeholder: t("accountsManagement.adminFields.passwordPlaceHolder"),
        label: t("accountsManagement.adminFields.password"),
        validation: {
          required: "كلمة المرور مطلوبة مطلوب",
          minLength: {
            value: 8,
            message: "كلمة المرور يجب ألا تقل عن 8 أحرف",
          },
        },
      },
      {
        name: "is_active",
        type: "single-select",
        placeholder: t("accountsManagement.adminFields.accountStatus"),
        label: t("accountsManagement.adminFields.accountStatusPlaceHolder"),
        options: [
          { label: "نشط", value: 1 },
          { label: "غير نشط", value: 0 },
        ],
        validation: {
          required: "حالة الحساب مطلوبة",
        },
      },
      {
        name: "email",
        type: "text",
        placeholder: t("accountsManagement.adminFields.emailPlaceHolder"),
        label: t("accountsManagement.adminFields.email"),
        validation: {
          required: "البريد الإلكتروني مطلوب",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "الرجاء إدخال بريد إلكتروني صحيح",
          },
        },
      },
      {
        name: "role_id",
        type: "single-select",
        placeholder: t("accountsManagement.adminFields.permissionPlaceHolder"),
        label: t("accountsManagement.adminFields.permission"),
        options: rolesOptions,
        validation: {
          required: "دور الحساب مطلوب",
        },
      },
      {
        name: "departments",
        type: "multiple-select",
        placeholder: t("accountsManagement.adminFields.departmentsPlaceHolder"),
        label: t("accountsManagement.adminFields.departments"),
        options: departmentsOptions,
        validation: {
          required: "دور الحساب مطلوب",
        },
        full_width: true,
      },
    ],
    [t, rolesOptions, departmentsOptions],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      name: "",
      phone: "",
      password: "",
      email: "",
      role_id: "",
      departments: [],
      is_active: 0,
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const payload = { ...data, phone: "966" + data?.phone };
      const res = await adminsService.addAdmin(payload);
      toast.success(t("accountsManagement.addAdminSuccessStatus"));
      navigate(-1);
      // console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(t("global.errorProcessingRequest"));
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
        <BreedCrump breed_title={t("layouts.sideBar.accounts.admins")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("accountsManagement.addAdmin")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("accountsManagement.addAdmin")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddAdmin;
