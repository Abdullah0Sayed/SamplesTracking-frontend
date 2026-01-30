import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useMasterSteps from "../../../../hooks/masterSteps/useMasterSteps";
import { masterStepsService } from "../../../../services/masterSteps/masterStepsService";

const EditMasterStep = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const location = useLocation();
  const recordID = useParams();

  const { fetchMasterStep } = useMasterSteps();
  const [objectRecord, setObjectRecord] = useState(null);

  /** Load admin data */
  useEffect(() => {
    console.log(recordID);
    if (!recordID) return;

    const loadObject = async () => {
      try {
        const { data } = await fetchMasterStep(recordID);
        console.log(data.data);
        setObjectRecord(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadObject();
  }, [recordID]);

  /** Form Fields */
  const FIELDS = useMemo(
    () => [
      {
        name: "step_code",
        type: "text",
        placeholder: t(
          "masterStepsManagement.masterStepsFields.stepCodePlaceHolder",
        ),
        label: t("masterStepsManagement.masterStepsFields.stepCode"),
        validation: {
          required: "كود الخطوة مطلوب",
        },
      },
      {
        name: "step_name",
        type: "text",
        placeholder: t(
          "masterStepsManagement.masterStepsFields.stepNamePlaceHolder",
        ),
        label: t("masterStepsManagement.masterStepsFields.stepName"),
        validation: {
          required: "اسم الخطوة مطلوب",
        },
      },
      {
        name: "description",
        type: "text",
        placeholder: t(
          "masterStepsManagement.masterStepsFields.descriptionPlaceHolder",
        ),
        label: t("masterStepsManagement.masterStepsFields.description"),
        full_width: true,
      },
    ],
    [t],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      step_code: objectRecord?.step_code || "",
      step_name: objectRecord?.step_name || "",
      description: objectRecord?.description || "",
    }),
    [objectRecord],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const payload = { id: objectRecord?.id, ...data };
      const res = await masterStepsService.updateMasterStep(payload);
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.masterSteps")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("masterStepsManagement.editMasterStep")}
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

export default EditMasterStep;
