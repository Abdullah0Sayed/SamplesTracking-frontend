import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { testCodesService } from "../../../../services/testCodesService/testCodesService";
import { masterStepsService } from "../../../../services/masterSteps/masterStepsService";
import { departmentsService } from "../../../../services/departments/departmentsService";
import { workflowStepsService } from "../../../../services/workflowSteps/workflowStepsService";

const AddWorkflowStep = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const [testTypesOptions, setTestTypesOptions] = useState([]);
  const [masterStepsOptions, setMasterStepsOptions] = useState([]);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const isFinalStepsOptions = [
    { label: t("global.yes"), value: 1 },
    { label: t("global.no"), value: 0 },
  ];

  const loadTestTypes = useMemo(async () => {
    try {
      const { data } =
        await testCodesService.getAllTestCodesWithoutPagination();
      setTestTypesOptions(
        data?.data?.map((testType) => ({
          label: testType.code,
          value: testType.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);
  const loadMasterSteps = useMemo(async () => {
    try {
      const { data } =
        await masterStepsService.getAllMasterStepsWithoutPagination();
      setMasterStepsOptions(
        data?.data?.map((masterStep) => ({
          label: masterStep.step_code,
          value: masterStep.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);
  const loadDepartments = useMemo(async () => {
    try {
      const { data } =
        await departmentsService.getAllDepartmentsWithoutPagination();
      setDepartmentsOptions(
        data?.data?.map((department) => ({
          label: department.department_code,
          value: department.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Form Fields */
  const FIELDS = useMemo(
    () => [
      {
        name: "test_type_id",
        type: "single-select",
        options: testTypesOptions,
        placeholder: t(
          "workflowStepsManagement.workflowStepsFields.testTypePlaceHolder",
        ),
        label: t("workflowStepsManagement.workflowStepsFields.testType"),
        validation: {
          required: "اسم وحدة التخزين مطلوب",
        },
      },
      {
        name: "master_step_id",
        type: "single-select",
        options: masterStepsOptions,
        placeholder: t(
          "workflowStepsManagement.workflowStepsFields.masterStepPlaceHolder",
        ),
        label: t("workflowStepsManagement.workflowStepsFields.masterStep"),
        validation: {
          required: "خطوة التنفيذ مطلوب",
        },
      },
      {
        name: "department_id",
        type: "single-select",
        options: departmentsOptions,
        placeholder: t(
          "workflowStepsManagement.workflowStepsFields.departmentPlaceHolder",
        ),
        label: t("workflowStepsManagement.workflowStepsFields.department"),
        validation: {
          required: "اختيار القسم مطلوب",
        },
      },
      {
        name: "step_order",
        type: "number",
        min: 1,
        placeholder: t(
          "workflowStepsManagement.workflowStepsFields.stepOrderPlaceHolder",
        ),
        label: t("workflowStepsManagement.workflowStepsFields.stepOrder"),
        validation: {
          required: "ترتيب خطوة التنفيذ مطلوب",
          min: {
            value: 1,
            message: "أقل قيمة ممكنة هي 1",
          },
        },
      },
      {
        name: "is_final_step",
        type: "single-select",
        options: isFinalStepsOptions,
        placeholder: t(
          "workflowStepsManagement.workflowStepsFields.finalStepPlaceHolder",
        ),
        label: t("workflowStepsManagement.workflowStepsFields.finalStep"),
        validation: {
          required: "مطلوب تحديد إذا كانت أخر خطوة أم لا",
        },
        full_width: true,
      },
    ],
    [
      t,
      testTypesOptions,
      masterStepsOptions,
      departmentsOptions,
      isFinalStepsOptions,
    ],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      test_type_id: "",
      master_step_id: "",
      department_id: "",
      step_order: "",
      is_final_step: 0,
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const res = await workflowStepsService.addNewWorkflowStep(data);
      toast.success(t("workflowStepsManagement.addWorkflowStepSuccessStatus"));
      navigate(-1);
      // console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
        <BreedCrump breed_title={t("layouts.sideBar.settings.workflowSteps")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("workflowStepsManagement.addWorkflowStep")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("workflowStepsManagement.addWorkflowStep")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddWorkflowStep;
