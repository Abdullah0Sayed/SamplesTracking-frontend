import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useWorkflows from "../../../hooks/workflows/useWorkflows";
import BreedCrump from "../../../components/ui/BreedCrump";
import Form from "../../../components/forms/Form";
import { sampleService } from "../../../services/samples/sampleService";
import { workflowService } from "../../../services/workflows/workflowService";
import useTestCodes from "../../../hooks/testCodes/useTestCodes";
import { testCodesService } from "../../../services/testCodesService/testCodesService";

const AddSample = () => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const lang = useSelector((state) => state.webLanguage);

  /** ------------------ DATA ------------------ */
  const [testTypesOptions, setTestTypesOptions] = useState([]);

  /** ------------------ FETCH Test Types ------------------ */
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

  /** ------------------ FORM FIELDS ------------------ */
  const FIELDS = useMemo(
    () => [
      {
        name: "test_type_id",
        type: "single-select",
        options: testTypesOptions,
        label: t("samplesManagement.samplesFields.testType"),
        placeholder: t("samplesManagement.samplesFields.testTypePlaceHolder"),
        validation: {
          required: "العينة مطلوبة",
        },
      },
      {
        name: "received_from",
        type: "text",
        label: t("samplesManagement.samplesFields.receivedFrom"),
        placeholder: t(
          "samplesManagement.samplesFields.receivedFromPlaceHolder",
        ),
        validation: {
          required: "اسم الجهة المستلم منها العينة مطلوب",
        },
      },
      {
        name: "received_by",
        type: "text",
        label: t("samplesManagement.samplesFields.receivedBy"),
        placeholder: t("samplesManagement.samplesFields.receivedByPlaceHolder"),
        validation: {
          required: "اسم مستلم العينة مطلوب",
        },
      },
      //   {
      //     name: "workflow_id",
      //     type: "single-select",
      //     label: t("samplesManagement.samplesFields.workflow"),
      //     placeholder: t("samplesManagement.samplesFields.workflowPlaceHolder"),
      //     options: workflowsOptions,
      //     validation: {
      //       required: "مسار العمل مطلوب",
      //     },
      //     onChange: (value, setValue) => {
      //       setSelectedWorkflowID(value);
      //       setValue("sample_code_id", "");
      //     },
      //   },
      //   {
      //     name: "sample_code_id",
      //     type: "single-select",
      //     label: t("samplesManagement.samplesFields.sampleCode"),
      //     placeholder: t("samplesManagement.samplesFields.sampleCodePlaceHolder"),
      //     options: sampleCodesOptions,
      //     validation: {
      //       required: "رمز الأختبار مطلوب",
      //     },
      //     isDisabled: !selectedWorkflowID || loadingSampleCodes,
      //   },
    ],
    [t, testTypesOptions],
  );

  /** ------------------ INITIAL VALUES ------------------ */
  const INITIAL_VALUES = useMemo(
    () => ({
      test_type_id: "",
      received_from: "",
      received_by: "",
    }),
    [],
  );

  /** ------------------ SUBMIT ------------------ */
  const onSubmit = async (data) => {
    try {
      await sampleService.addSample(data);
      toast.success(t("samplesManagement.addSampleSuccessStatus"));
      navigate(-1);
    } catch (error) {
      console.error(error);
      toast.error(t("global.errorProcessingRequest"));
    }
  };

  /** ------------------ UI ------------------ */
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-row gap-2 items-center">
        <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
        <BreedCrump breed_title={t("layouts.sideBar.settings.sampleCodes")} />
      </div>

      {/* Form Card */}
      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("samplesManagement.addSample")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("samplesManagement.addSample")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddSample;
