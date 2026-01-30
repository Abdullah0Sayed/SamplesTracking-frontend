import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useTestCodes from "../../../../hooks/testCodes/useTestCodes";
import { testCodesService } from "../../../../services/testCodesService/testCodesService";
import useSampleCodes from "../../../../hooks/sampleCodes/useSampleCodes";

const EditTestCode = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { fetchTestCode } = useTestCodes();
  const [objectRecord, setObjectRecord] = useState(null);

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
  /** Load admin data */
  useEffect(() => {
    console.log(id);
    if (!id) return;

    const loadObject = async () => {
      try {
        const { data } = await fetchTestCode(id);
        console.log(data.data);
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
      name: objectRecord?.name || "",
      code: objectRecord?.code || "",
      sample_types: objectRecord?.sample_types?.map((st) => st.id) || [],
    }),
    [objectRecord],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const payload = { id: objectRecord?.id, ...data };

      const res = await testCodesService.updateTestCode(payload);
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.testCodes")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("testCodesManagement.editTestCode")}
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

export default EditTestCode;
