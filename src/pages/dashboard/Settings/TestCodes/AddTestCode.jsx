import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { testCodesService } from "../../../../services/testCodesService/testCodesService";
import useSampleCodes from "../../../../hooks/sampleCodes/useSampleCodes";

const AddTestCode = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const [sampleTypesOptions, setSampleTypesOptions] = useState([]);
  const { fetchSampleCodesWithoutPagination } = useSampleCodes();

  useEffect(() => {
    const loadSampleTypes = async () => {
      try {
        const { data } = await fetchSampleCodesWithoutPagination();
        setSampleTypesOptions(
          data?.data?.map((st) => ({
            value: st.id,
            label: st.code,
          })) || [],
        );
      } catch (error) {
        console.log(error);
      }
    };

    loadSampleTypes();
  }, []);

  /** Form Fields */
  const FIELDS = useMemo(
    () => [
      {
        name: "code",
        type: "text",
        placeholder: t("testCodesManagement.testCodesFields.codePlaceHolder"),
        label: t("testCodesManagement.testCodesFields.code"),
        validation: {
          required: "كود الاختبار مطلوب",
        },
      },
      {
        name: "name",
        type: "text",
        placeholder: t("testCodesManagement.testCodesFields.namePlaceHolder"),
        label: t("testCodesManagement.testCodesFields.name"),
        validation: {
          required: 'اسم  "كود" الإختبار مطلوب',
        },
      },
      {
        name: "sample_types",
        type: "multiple-select",
        options: sampleTypesOptions,
        placeholder: t(
          "testCodesManagement.testCodesFields.sampleTypesPlaceHolder",
        ),
        label: t("testCodesManagement.testCodesFields.sampleTypes"),
        full_width: true,
      },
    ],
    [t, sampleTypesOptions],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      code: "",
      name: "",
      sample_types: [],
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const res = await testCodesService.addTestCode(data);
      toast.success(t("testCodesManagement.addTestCodeSuccessStatus"));
      navigate(-1);
      // console.log(data);
    } catch (error) {
      console.log(error);
      // toast.error(t('global.errorProcessingRequest'));
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
        <BreedCrump breed_title={t("layouts.sideBar.settings.testCodes")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("testCodesManagement.addTestCode")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("testCodesManagement.addTestCode")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddTestCode;
