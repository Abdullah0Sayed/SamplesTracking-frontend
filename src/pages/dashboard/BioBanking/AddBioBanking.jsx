import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import BreedCrump from "../../../components/ui/BreedCrump";
import Form from "../../../components/forms/Form";
import { bioBankingService } from "../../../services/bioBanking/bioBankingService";
import { sampleService } from "../../../services/samples/sampleService";
import { storageLocationsService } from "../../../services/storageLocations/storageLocationsService";

const AddBioBanking = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const navigate = useNavigate();
  const [samplesOptions, setSamplesOptions] = useState([]);
  const [storageLocationsOptions, setStorageLocationsOptions] = useState([]);
  const [itemTypeValue, setItemTypeValue] = useState("");
  const [cultureObjectTypeValue, setCultureObjectTypeValue] = useState("");
  const [tubeTypesAliquotOptions, settubeTypesAliquotOptions] = useState([
    { label: "Cryovial 1.5 mL", value: "Cryovial 1.5 mL" },
    { label: "Cryovial 2.0 mL", value: "Cryovial 2.0 mL" },
    { label: "Eppendorf 1.5 mL", value: "Eppendorf 1.5 mL" },
    { label: "Eppendorf 2.0 mL", value: "Eppendorf 2.0 mL" },
  ]);
  const [tubeTypesCultureOptions, settubeTypesCultureOptions] = useState([
    { label: "Cryovial 1.5 mL", value: "Cryovial 1.5 mL" },
    { label: "Cryovial 2.0 mL", value: "Cryovial 2.0 mL" },
  ]);
  const loadSamples = useMemo(async () => {
    try {
      const { data } = await sampleService.getAllSamplesWithoutPagination();
      console.log(data);
      setSamplesOptions(
        data?.data?.map((sample) => ({
          value: sample.id,
          label: sample.barcode,
        })) || [],
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadStorageLocations = useMemo(async () => {
    try {
      const { data } =
        await storageLocationsService.getAllStorageLocationsWithoutPagination();
      console.log(data);
      setStorageLocationsOptions(
        data?.data?.map((storageLocation) => ({
          value: storageLocation.id,
          label: storageLocation.unit_name + " / " + storageLocation.unit_type,
        })) || [],
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  /** Form Fields */
  const FIELDS = useMemo(
    () =>
      [
        {
          name: "sample_id",
          type: "single-select",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.samplePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.sample"),
          options: samplesOptions,
          validation: {
            required: "العينة المراد حفظها مطلوبة",
          },
        },
        {
          name: "item_type",
          type: "single-select",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.itemTypePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.itemType"),
          options: [
            { label: "PLATE", value: "PLATE" },
            { label: "ALIQUOT", value: "ALIQUOT" },
            { label: "CULTURE_STOCK", value: "CULTURE_STOCK" },
          ],
          onChange: (value) => {
            setItemTypeValue(value);
            console.log(value);
          },
          validation: {
            required: "نوع حفظ العينة مطلوب",
          },
        },
        /* ========== ITEM TYPE --> (PLATE) ========== */
        itemTypeValue === "PLATE" && {
          name: "plate_type",
          type: "single-select",
          options: [
            { label: "DNA Plate", value: "DNA Plate" },
            { label: "RNA Plate", value: "RNA Plate" },
            { label: "NA Elution Plate", value: "NA Elution Plate" },
            { label: "PCR Product Plate", value: "PCR Product Plate" },
            { label: "Library Plate", value: "Library Plate" },
            { label: "QC Plate", value: "QC Plate" },
            { label: "WGS DNA Plate", value: "WGS DNA Plate" },
            { label: "Genotyping DNA Plate", value: "Genotyping DNA Plate" },
            { label: "PCR Plate", value: "PCR Plate" },
            { label: "Sequencing Plate", value: "Sequencing Plate" },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.plateTypePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.plateType"),
          validation: {
            required: "نوع اللوحة مطلوب",
          },
        },
        itemTypeValue === "PLATE" && {
          name: "total_wells",
          type: "single-select",
          options: [
            { label: "24", value: "24" },
            { label: "48", value: "48" },
            { label: "384", value: "384" },
            { label: "96", value: "96" },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.totalWellsPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.totalWells"),
        },
        itemTypeValue === "PLATE" && {
          name: "plate_status",
          type: "single-select",
          options: [
            { label: "whole", value: "whole" },
            { label: "partial", value: "partial" },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.plateStatusPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.plateStatus"),
        },
        /* ========== ITEM TYPE --> (ALIQUOT) ========== */
        itemTypeValue === "ALIQUOT" && {
          name: "aliquot_number",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.aliquotNumberPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.aliquotNumber"),
          validation: {
            required: "عدد العينات الجزئية مطلوب",
          },
        },
        itemTypeValue === "ALIQUOT" && {
          name: "material_type",
          type: "single-select",
          options: [
            { label: "DNA", value: "DNA" },
            { label: "RNA", value: "RNA" },
            { label: "PCR Product", value: "PCR Product" },
            { label: "Library", value: "Library" },
            { label: "Culture", value: "Culture" },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.materialTypePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.materialType"),
          validation: {
            required: "نوع المادة مطلوب مطلوب",
          },
        },
        itemTypeValue === "ALIQUOT" && {
          name: "concentration",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.concentrationPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.concentration"),
        },
        /* ========== ITEM TYPE --> (CULTURE_STOCK) ========== */
        itemTypeValue === "CULTURE_STOCK" && {
          name: "media_type",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.mediaTypePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.mediaType"),
          validation: {
            required: "نوع الوسط مطلوب",
          },
        },
        itemTypeValue === "CULTURE_STOCK" && {
          name: "glycerol_percentage",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.glycerolPercentagePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.glycerolPercentage"),
          validation: {
            required: "تحديد نسبة الجليسرول مطلوب مطلوب",
          },
        },
        itemTypeValue === "CULTURE_STOCK" && {
          name: "culture_object_type",
          type: "single-select",
          options: [
            { label: "Bacteria", value: "Bacteria" },
            { label: "Fungi", value: "Fungi" },
            { label: "Yeast", value: "Yeast" },
            { label: "Other", value: "Other" },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.cultureObjectTypePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.cultureObjectType"),
          validation: {
            required: "نوع الكائن مطلوب",
          },
        },
        itemTypeValue === "CULTURE_STOCK" &&
          cultureObjectTypeValue === "Other" && {
            name: "culture_object_type_name",
            type: "text",
            placeholder: t(
              "bioBankingManagement.bioBankingFields.cultureObjectTypeNamePlaceHolder",
            ),
            label: t(
              "bioBankingManagement.bioBankingFields.cultureObjectTypeName",
            ),
            validation: {
              required: "نوع الكائن مطلوب",
            },
          },
        itemTypeValue === "CULTURE_STOCK" && {
          name: "tubes_number",
          type: "number",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.tubesNumberPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.tubesNumber"),
          validation: {
            required: "عدد الانابيب مطلوب",
            min: {
              value: 0,
              message: "أقل قيمة مسموحة للأنابيب هي 0",
            },
          },
        },
        (itemTypeValue === "ALIQUOT" || itemTypeValue === "CULTURE_STOCK") && {
          name: "sample_status",
          type: "single-select",
          options: [
            { label: "Available", value: "Available" },
            { label: "Consumed", value: "Consumed" },
            { label: "Discarded", value: "Discarded" },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.sampleStatusPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.sampleStatus"),
          validation: {
            required: "حالة العينة مطلوبة",
          },
        },
        (itemTypeValue === "ALIQUOT" || itemTypeValue === "CULTURE_STOCK") && {
          name: "volume",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.volumePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.volume"),
          validation: {
            required: "حجم الأنبوب مطلوب",
          },
        },
        {
          name: "storage_temp",
          type: "single-select",
          options: [
            { label: "-80", value: -80 },
            { label: "-20", value: -20 },
            { label: "4", value: 4 },
          ],
          placeholder: t(
            "bioBankingManagement.bioBankingFields.temperaturePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.temperature"),
          validation: {
            required: "درجة الحرارة مطلوبة",
          },
        },
        (itemTypeValue === "ALIQUOT" || itemTypeValue === "CULTURE_STOCK") && {
          name: "tube_type",
          type: "single-select",
          options:
            itemTypeValue === "ALIQUOT"
              ? tubeTypesAliquotOptions
              : tubeTypesCultureOptions,
          placeholder: t(
            "bioBankingManagement.bioBankingFields.tubeTypePlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.tubeType"),
        },
        {
          name: "storage_location_id",
          type: "single-select",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.storageLocationPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.storageLocation"),
          options: storageLocationsOptions,
          validation: {
            required: "موقع التخزين مطلوب مطلوب",
          },
        },
        {
          name: "shelf_id",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.shelfPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.shelf"),
          validation: {
            required: "موقع الرف مطلوب",
          },
        },
        {
          name: "rack_id",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.rackPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.rack"),
        },
        {
          name: "box_id",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.boxPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.box"),
        },
        {
          name: "position_id",
          type: "text",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.positionPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.position"),
        },
        {
          name: "notes",
          type: "textArea",
          placeholder: t(
            "bioBankingManagement.bioBankingFields.notesPlaceHolder",
          ),
          label: t("bioBankingManagement.bioBankingFields.notes"),
          full_width: true,
        },
        // {
        //   name: "attachments",
        //   type: "file",
        //   placeholder: t(
        //     "bioBankingManagement.bioBankingFields.attachmentsPlaceHolder",
        //   ),
        //   label: t("bioBankingManagement.bioBankingFields.attachments"),
        //   full_width: true,
        // },
      ].filter(Boolean),
    [
      t,
      samplesOptions,
      storageLocationsOptions,
      itemTypeValue,
      cultureObjectTypeValue,
      tubeTypesAliquotOptions,
      tubeTypesCultureOptions,
    ],
  );

  /** Initial Values */
  const INITIAL_VALUES = useMemo(
    () => ({
      sample_id: "",
      item_type: "",
      plate_type: null,
      total_wells: null,
      plate_status: null,
      aliquot_number: null,
      material_type: null,
      concentration: null,
      media_type: null,
      glycerol_percentage: null,
      culture_object_type: null,
      culture_object_type_name: null,
      tubes_number: null,
      sample_status: null,
      volume: "",
      storage_temp: "",
      tube_type: "",
      storage_location_id: "",
      shelf_id: "",
      rack_id: "",
      box_id: "",
      position_id: "",
      notes: "",
      // attachments: null,
    }),
    [],
  );

  /** Submit handler */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        // if (key === "attachments" || value === undefined || value === null)
        //   return;

        if (key === "used_wells") {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // 👇 فايل واحد فقط
      // if (data.attachments instanceof File) {
      //   formData.append("attachments", data.attachments);
      // }

      await bioBankingService.addBioBanking(formData);

      toast.success(t("bioBankingManagement.addBioBankingSuccessStatus"));
      navigate(-1, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الحفظ");
      navigate(-1, { replace: true });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <FaArrowRight onClick={() => navigate(-1)} className="cursor-pointer" />
        <BreedCrump breed_title={t("layouts.sideBar.bioBankingManagement")} />
      </div>

      <div className="w-full flex flex-col gap-2 rounded-2xl py-4 bg-white shadow-md">
        <p className="text-2xl px-4 font-semibold text-black">
          {t("bioBankingManagement.addBioBanking")}
        </p>

        <Form
          fields={FIELDS}
          gridLayout="grid-cols-2"
          initial_values={INITIAL_VALUES}
          submit_label={t("bioBankingManagement.addBioBanking")}
          showCancelBtn={false}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};

export default AddBioBanking;
