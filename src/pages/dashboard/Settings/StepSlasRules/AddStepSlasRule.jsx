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
import { stepSlasRulesService } from "../../../../services/stepSlasRules/stepSlasRulesService";

const AddStepSlasRule = () => {
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
          "stepSlasRulesManagement.stepSlasRulesFields.testTypePlaceHolder",
        ),
        label: t("stepSlasRulesManagement.stepSlasRulesFields.testType"),
        validation: {
          required: "اسم وحدة التخزين مطلوب",
        },
      },
      {
        name: "master_step_id",
        type: "single-select",
        options: masterStepsOptions,
        placeholder: t(
          "stepSlasRulesManagement.stepSlasRulesFields.masterStepPlaceHolder",
        ),
        label: t("stepSlasRulesManagement.stepSlasRulesFields.masterStep"),
        validation: {
          required: "خطوة التنفيذ مطلوب",
        },
      },
      {
        name: "department_id",
        type: "single-select",
        options: departmentsOptions,
        placeholder: t(
          "stepSlasRulesManagement.stepSlasRulesFields.departmentPlaceHolder",
        ),
        label: t("stepSlasRulesManagement.stepSlasRulesFields.department"),
        validation: {
          required: "اختيار القسم مطلوب",
        },
      },
      {
        name: "sla_minutes",
        type: "number",
        min: 1,
        placeholder: t(
          "stepSlasRulesManagement.stepSlasRulesFields.slaMinutesPlaceHolder",
        ),
        label: t("stepSlasRulesManagement.stepSlasRulesFields.slaMinutes"),
        validation: {
          required: "تحديد وقت تنفيذ العينة مطلوب",
          min: {
            value: 1,
            message: "أقل قيمة ممكنة هي 1",
          },
        },
      },
      {
        name: "warning_minutes",
        type: "text",
        placeholder: t(
          "stepSlasRulesManagement.stepSlasRulesFields.warningMinutesPlaceHolder",
        ),
        label: t("stepSlasRulesManagement.stepSlasRulesFields.warningMinutes"),
        validation: {
          required: "وقت التنبيه بالإشعار مطلوب",
        },
        full_width: true,
      },
    ],
    [t, testTypesOptions, masterStepsOptions, departmentsOptions],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      test_type_id: "",
      master_step_id: "",
      department_id: "",
      sla_minutes: 0,
      warning_minutes: 0,
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const res = await stepSlasRulesService.addNewStepSlasRule(data);
      toast.success(t("stepSlasRulesManagement.addStepSlasRuleSuccessStatus"));
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.stepSlasRules")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("stepSlasRulesManagement.addStepSlasRule")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("stepSlasRulesManagement.addStepSlasRule")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddStepSlasRule;
