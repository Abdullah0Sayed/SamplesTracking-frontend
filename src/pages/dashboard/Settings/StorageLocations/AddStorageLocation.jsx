import React, { useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import BreedCrump from "../../../../components/ui/BreedCrump";
import { useTranslation } from "react-i18next";
import Form from "../../../../components/forms/Form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { storageLocationsService } from "../../../../services/storageLocations/storageLocationsService";

const AddStorageLocation = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const isActiveOptions = [
    { label: "نشط", value: true },
    { label: "غير نشط", value: false },
  ];
  const unitTypesOptions = [
    { label: "FREEZER", value: "FREEZER" },
    { label: "REFRIGERATOR", value: "REFRIGERATOR" },
    { label: "ROOM_TEMP", value: "ROOM_TEMP" },
  ];
  /** Form Fields */
  const FIELDS = useMemo(
    () => [
      {
        name: "unit_name",
        type: "text",
        placeholder: t(
          "storageLocationsManagement.storageLocationsFields.unitNamePlaceHolder",
        ),
        label: t("storageLocationsManagement.storageLocationsFields.unitName"),
        validation: {
          required: "اسم وحدة التخزين مطلوب",
        },
      },
      {
        name: "unit_type",
        type: "single-select",
        placeholder: t(
          "storageLocationsManagement.storageLocationsFields.unitTypePlaceHolder",
        ),
        label: t("storageLocationsManagement.storageLocationsFields.unitType"),
        options: unitTypesOptions,
        validation: {
          required: "نوع موقع التخزين مطلوب",
        },
      },
      {
        name: "total_shelves",
        type: "text",
        placeholder: t(
          "storageLocationsManagement.storageLocationsFields.totalShelvesPlaceHolder",
        ),
        label: t(
          "storageLocationsManagement.storageLocationsFields.totalShelves",
        ),
        validation: {
          required: "إجمالي الرفوف مطلوب",
        },
      },
      {
        name: "racks_per_shelf",
        type: "text",
        placeholder: t(
          "storageLocationsManagement.storageLocationsFields.racksPerShelfPlaceHolder",
        ),
        label: t(
          "storageLocationsManagement.storageLocationsFields.racksPerShelf",
        ),
        validation: {
          required: "إجمالي عدد الراكات لكل رف مطلوب",
        },
      },
      {
        name: "box_capacity",
        type: "text",
        placeholder: t(
          "storageLocationsManagement.storageLocationsFields.boxCapacityPlaceHolder",
        ),
        label: t(
          "storageLocationsManagement.storageLocationsFields.boxCapacity",
        ),
        validation: {
          required: "سعة الصندوق مطلوب",
        },
      },
      {
        name: "active",
        type: "single-select",
        placeholder: t(
          "storageLocationsManagement.storageLocationsFields.activePlaceHolder",
        ),
        label: t("storageLocationsManagement.storageLocationsFields.active"),
        options: isActiveOptions,
        validation: {
          required: "حالة موقع التخزين مطلوبة مطلوب",
        },
      },
    ],
    [t, isActiveOptions, unitTypesOptions],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      unit_name: "",
      unit_type: "",
      total_shelves: "",
      racks_per_shelf: "",
      box_capacity: "",
      active: "",
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const res = await storageLocationsService.addNewStorageLocation(data);
      toast.success(
        t("storageLocationsManagement.addStorageLocationSuccessStatus"),
      );
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
        <BreedCrump
          breed_title={t("layouts.sideBar.settings.storageLocations")}
        />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("storageLocationsManagement.addStorageLocation")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("storageLocationsManagement.addStorageLocation")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddStorageLocation;
