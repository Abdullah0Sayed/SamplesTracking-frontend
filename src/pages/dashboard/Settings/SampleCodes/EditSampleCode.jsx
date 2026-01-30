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

const EditSampleCode = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const { fetchSampleCode } = useSampleCodes();
  const [objectRecord, setObjectRecord] = useState(null);

  /** Load admin data */
  useEffect(() => {
    if (!id) return;

    const loadObject = async () => {
      try {
        const { data } = await fetchSampleCode(id);
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
        placeholder: t(
          "sampleCodesManagement.sampleCodesFields.codePlaceHolder",
        ),
        label: t("sampleCodesManagement.sampleCodesFields.code"),
        validation: {
          required: "كود العينة مطلوب",
        },
      },
      {
        name: "name",
        type: "text",
        placeholder: t(
          "sampleCodesManagement.sampleCodesFields.namePlaceHolder",
        ),
        label: t("sampleCodesManagement.sampleCodesFields.name"),
        validation: {
          required: 'اسم نوع "كود" العنية مطلوب',
        },
      },
    ],
    [t],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      name: objectRecord?.name || "",
      code: objectRecord?.code || "",
    }),
    [objectRecord],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const payload = { id: objectRecord?.id, ...data };

      const res = await sampleCodesService.updateSampleCode(payload);
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.sampleCodes")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("sampleCodesManagement.editSampleCode")}
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

export default EditSampleCode;
