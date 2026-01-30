import React, { useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { masterStepsService } from "../../../../services/masterSteps/masterStepsService";

const AddMasterStep = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();

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
      step_code: "",
      step_name: "",
      description: null,
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const res = await masterStepsService.addNewMasterStep(data);
      toast.success(t("masterStepsManagement.deleteMasterStepSuccessStatus"));
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
        <BreedCrump breed_title={t("layouts.sideBar.settings.masterSteps")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("masterStepsManagement.addMasterStep")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("masterStepsManagement.addMasterStep")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddMasterStep;
