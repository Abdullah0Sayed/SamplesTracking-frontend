import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BiBarcode,
  BiBuilding,
  BiCalendar,
  BiCheckCircle,
  BiDoorOpen,
  BiScan,
  BiStopCircle,
  BiTestTube,
  BiUser,
  BiXCircle,
} from "react-icons/bi";
import {
  BsBoxArrowLeft,
  BsBoxArrowRight,
  BsInfo,
  BsPrinter,
} from "react-icons/bs";
import {
  FaArrowsSplitUpAndLeft,
  FaFlask,
  FaLinesLeaning,
} from "react-icons/fa6";
import Barcode from "react-barcode";
import { toast } from "react-toastify";
import { Navigate, useParams } from "react-router-dom";
import useBioBanking from "../../../hooks/bioBanking/useBioBanking";
import formatArabicDate from "../../../utils/formatArabicDate";
import Modal from "../../../components/modals/Modal";
const BioBankingProfile = () => {
  const { t } = useTranslation("global");
  const formattedDate = formatArabicDate;
  const spanColoring = (value) => {
    var color = "bg-blue-200 text-blue-600";
    switch (value) {
      case "received":
        color = "bg-blue-200 text-blue-600";
        break;
      case "in_progress":
      case 0:
        color = "bg-yellow-200 text-yellow-600";
        break;
      case "accepted":
      case "completed":
      case 1:
      case "سليمة":
        color = "bg-green-200 text-green-600";
        break;
      case "rejected":
      case "canceled":
      case "غير صالحة":
        color = "bg-red-200 text-red-600";
        break;
      case "pending":
        color = "bg-gray-200 text-gray-600";
        break;
    }

    return color;
  };
  const [isOpenPrintBarcodeModal, setIsOpenPrintBarcodeModal] = useState(false);

  const { id } = useParams();
  const { fetchBioBanking } = useBioBanking();

  const [objectRecord, setObjectRecord] = useState(null);

  /* ================= Load BioBanking Record ================= */
  useEffect(() => {
    if (!id) return;

    const loadObject = async () => {
      try {
        const { data } = await fetchBioBanking(id);
        console.log(data?.data);
        setObjectRecord(data?.data);
      } catch (error) {
        console.error(error);
        toast.error(t("global.errorProcessingRequest"));
      }
    };

    loadObject();
  }, [id]);

  return (
    <>
      <div className={"flex flex-col gap-4"}>
        <div
          className="w-full bg-white rounded-xl shadow-md grid grid-cols-2 p-4 gap-4"
          style={{
            backgroundImage: "url('/labPattern.jpg')",
            backgroundSize: "32rem",
            backgroundRepeat: "repeat",
            backgroundBlendMode: "multiply",
          }}
        >
          <div
            className={`col-span-2 w-full flex flex-row justify-between items-center`}
          >
            <p className={`text-2xl font-semibold`}>
              {t("bioBankingManagement.bioBankingProfile.title")}
            </p>
          </div>

          {/* Sub Barcode */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiBarcode className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.subBarCode")}
              </p>
            </div>
            <div>
              <p className={`text-base font-semibold text-black/40`}>
                {objectRecord?.sub_barcode ?? "غير مسجل"}
              </p>
              {/* <Barcode value={sample?.barcode} className={`w-40`} /> */}
            </div>
          </div>

          {/* Test Type */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <FaFlask className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.testType")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {objectRecord?.sample?.test_type?.code ?? "غير مسجل"}
            </p>
          </div>

          {/* Sub BarCode */}
          <div className={`flex flex-col gap-4`}>
            <div
              className={`w-64 cursor-pointer`}
              onClick={() => setIsOpenPrintBarcodeModal(true)}
            >
              <Barcode
                value={objectRecord?.sub_barcode}
                className={`w-full h-16`}
              />
            </div>
          </div>

          {/* Item Type */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <FaLinesLeaning className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.itemType")}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 `}
            >
              {objectRecord?.item_type ?? "غير مسجل"}
            </p>
          </div>

          {/* MediaType */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiBuilding className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.mediaType")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {objectRecord?.media_type ?? "غير مسجل"}
            </p>
          </div>

          {/* glycerol Percentage */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiUser className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.glycerolPercentage")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {objectRecord?.glycerol_percentage ?? "غير مسجل"} {"%"}
            </p>
          </div>

          {/* Tube Type */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiDoorOpen className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.tubeType")}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 `}
            >
              {objectRecord?.tube_type ?? "غير مسجل"}
            </p>
          </div>

          {/* temperature */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiDoorOpen className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.temperature")}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 `}
            >
              {objectRecord?.storage_temp ?? "غير مسجل"}
            </p>
          </div>

          {/* storageLocation */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiDoorOpen className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.storageLocation")}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100`}
            >
              {objectRecord?.storage_location?.unit_name ?? "غير مسجل"}
            </p>
          </div>

          {/* createdBy */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiDoorOpen className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.createdBy")}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 `}
            >
              {objectRecord?.created_by?.name}
            </p>
          </div>

          {/* created_at */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiCalendar className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("bioBankingManagement.bioBankingProfile.date")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {formattedDate(objectRecord?.created_at).toLocaleDateString(
                "ar-EG",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </p>
          </div>
        </div>
        {/* Notes */}
        <div className="w-full bg-white rounded-xl shadow-md flex flex-col p-4 gap-4">
          <p className={`text-2xl font-semibold`}>
            {t("bioBankingManagement.bioBankingProfile.notes.title")}
          </p>
          <div className={`rounded-md flex flex-col gap-4 p-2 bg-gray-100`}>
            {objectRecord?.notes}
          </div>
        </div>
        {/* Attachments */}
        <div className="w-full bg-white rounded-xl shadow-md flex flex-col p-4 gap-4">
          <p className={`text-2xl font-semibold`}>
            {t("bioBankingManagement.bioBankingProfile.attachments.title")}
          </p>
          <div className={`rounded-md flex flex-col gap-4 p-2 bg-gray-100`}>
            {objectRecord?.att}
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {isOpenPrintBarcodeModal && (
        <Modal onClose={() => setIsOpenPrintBarcodeModal(false)}>
          <div className={`flex flex-col gap-4 items-center justify-center`}>
            <Barcode value={objectRecord?.sub_barcode} className={``} />

            <button
              className={`w-full print:hidden py-3 flex flex-row items-center justify-center gap-2 bg-primary-color text-white rounded-2xl hover:scale-95 transition-all`}
              onClick={() => print()}
            >
              <BsPrinter />
              {t("bioBankingManagement.bioBankingProfile.printBarcode")}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BioBankingProfile;
