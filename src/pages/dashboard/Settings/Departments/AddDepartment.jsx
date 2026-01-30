import React, { useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { departmentsService } from "../../../../services/departments/departmentsService";

const AddDepartment = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const isActiveOptions = [
    { label: "نشط", value: true },
    { label: "غير نشط", value: false },
  ];
  /** Form Fields */
  const FIELDS = useMemo(
    () => [
      {
        name: "department_code",
        type: "text",
        placeholder: t(
          "departmentsManagement.departmentsFields.codePlaceHolder",
        ),
        label: t("departmentsManagement.departmentsFields.code"),
        validation: {
          required: "كود القسم مطلوب",
        },
      },
      {
        name: "department_name",
        type: "text",
        placeholder: t(
          "departmentsManagement.departmentsFields.namePlaceHolder",
        ),
        label: t("departmentsManagement.departmentsFields.name"),
        validation: {
          required: "اسم القسم مطلوب",
        },
      },
      {
        name: "is_active",
        type: "single-select",
        options: isActiveOptions,
        placeholder: t(
          "departmentsManagement.departmentsFields.isActivePlaceHolder",
        ),
        label: t("departmentsManagement.departmentsFields.isActive"),
        full_width: true,
      },
    ],
    [t, lang],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      department_name: "",
      department_code: "",
      is_active: 1,
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const res = await departmentsService.addNewDepartment(data);
      toast.success(t("departmentsManagement.addDepartmentSuccessStatus"));
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.departments")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("departmentsManagement.addDepartment")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("departmentsManagement.addDepartment")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddDepartment;
