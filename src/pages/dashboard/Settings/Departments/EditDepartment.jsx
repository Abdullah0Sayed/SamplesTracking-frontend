import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSampleCodes from "../../../../hooks/sampleCodes/useSampleCodes";
import { sampleCodesService } from "../../../../services/sampleCodesService/sampleCodesService";
import { departmentsService } from "../../../../services/departments/departmentsService";
import useDepartments from "../../../../hooks/departments/useDepartments";

const EditDepartment = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const location = useLocation();
  const recordId = useParams();

  const { fetchDepartment } = useDepartments();
  const [objectRecord, setObjectRecord] = useState(null);
  const isActiveOptions = [
    { label: "نشط", value: true },
    { label: "غير نشط", value: false },
  ];
  /** Load admin data */
  useEffect(() => {
    console.log(recordId);
    if (!recordId) return;

    const loadObject = async () => {
      try {
        const { data } = await fetchDepartment(recordId);
        console.log(data.data);
        setObjectRecord(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadObject();
  }, [recordId]);

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
    [t, isActiveOptions],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      department_name: objectRecord?.department_name || "",
      department_code: objectRecord?.department_code || "",
      is_active: objectRecord?.is_active || "",
    }),
    [objectRecord],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const payload = { id: objectRecord?.id, ...data };
      console.log(payload);
      const res = await departmentsService.updateDepartment(payload);
      toast.success(`${t("global.successUpdateProcessingRequest")}`);
      navigate(-1);
    } catch (error) {
      console.error(error);
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
          {t("departmentsManagement.editDepartment")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("global.save")}
          showCancelBtn={true}
          onSubmit={onSubmit}
          onCancel={() => navigate(-1)}
          enableReinitialize={true}
        />
      </div>
    </div>
  );
};

export default EditDepartment;
