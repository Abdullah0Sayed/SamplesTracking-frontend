import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { workflowStepsService } from "../../../../services/workflowSteps/workflowStepsService";
import useWorkflowSteps from "../../../../hooks/workflowSteps/useWorkflowSteps";
import { testCodesService } from "../../../../services/testCodesService/testCodesService";
import { masterStepsService } from "../../../../services/masterSteps/masterStepsService";
import { departmentsService } from "../../../../services/departments/departmentsService";
import useStepSlasRules from "../../../../hooks/stepSlasRules/useStepSlasRules";
import { stepSlasRulesService } from "../../../../services/stepSlasRules/stepSlasRulesService";
const EditStepSlasRule = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { fetchStepSlasRule } = useStepSlasRules();
  const [objectRecord, setObjectRecord] = useState(null);
  const [testTypesOptions, setTestTypesOptions] = useState([]);
  const [masterStepsOptions, setMasterStepsOptions] = useState([]);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);

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

  /** Load admin data */
  useEffect(() => {
    console.log(id);
    if (!id) return;

    const loadObject = async () => {
      try {
        const { data } = await fetchStepSlasRule(id);
        console.log(data);
        setObjectRecord(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadObject();
  }, [id]);

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
      test_type_id: objectRecord?.test_type?.id || "",
      master_step_id: objectRecord?.master_step?.id || "",
      department_id: objectRecord?.department?.id || "",
      sla_minutes: objectRecord?.sla_minutes || "",
      warning_minutes: objectRecord?.warning_minutes || 0,
    }),
    [objectRecord],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const payload = { id: objectRecord?.id, ...data };
      const res = await stepSlasRulesService.updateStepSlasRule(payload);
      console.log(payload);
      console.log(res);
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.stepSlasRules")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("stepSlasRulesManagement.editStepSlasRule")}
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

export default EditStepSlasRule;
