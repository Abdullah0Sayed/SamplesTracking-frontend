import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import formatArabicDate from "../../../../utils/formatArabicDate";
import { useForm, useFieldArray } from "react-hook-form";
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
import { IoDocument, IoInformationCircle } from "react-icons/io5";
import Barcode from "react-barcode";
import Modal from "../../../modals/Modal";
import { toast } from "react-toastify";
import { sampleService } from "../../../../services/samples/sampleService";
import { Link, Navigate, useNavigate } from "react-router-dom";

const MainData = ({ sample = null }) => {
  const { t } = useTranslation("global");
  const navigate = useNavigate();
  const [qcReceivingStatus, setQcReceivingStatus] = useState(null);
  const [moveToNextDepartmentState, setMoveToNextDepartmentState] =
    useState(null);
  const [isOpenPrintBarcodeModal, setIsOpenPrintBarcodeModal] = useState(false);
  const [isOpenReceivingQcModal, setIsOpenReceivingQcModal] = useState(false);
  const [isOpenMoveToNextDepartmentModal, setIsOpenMoveToNextDepartmentModal] =
    useState(false);
  const [isOpenAddTestResultsModal, setIsOpenAddTestResultsModal] =
    useState(false);
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

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      step_status: "",
      results: [{ key: "", type: "string", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "results",
  });

  const onSubmit = async (formData) => {
    try {
      const results = {};

      formData?.results.forEach((item) => {
        if (!item.key) return;

        let parsedValue;

        switch (item.type) {
          case "number":
            parsedValue = Number(item.value);
            break;
          case "boolean":
            parsedValue = item.value === "true";
            break;
          // case "json":
          //   parsedValue = JSON.parse(item.value);
          //   break;
          default:
            parsedValue = item.value;
        }

        results[item.key] = parsedValue;
      });

      const payload = {
        sample_id: sample?.id,
        step_status: formData?.step_status,
        results,
      };
      console.log(payload);
      const { data } = await sampleService.addTestResultsForStep(payload);
      toast.success(data?.message);
      setIsOpenAddTestResultsModal(false);
      location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setIsOpenAddTestResultsModal(false);
      location.reload();
      console.log(error);
    }
  };

  /* ========== EFFECT ========== */
  /* ========== Update RECEIVING QC ========== */
  useEffect(() => {
    const updateReceivingQcStatus = async () => {
      try {
        const { data } = await sampleService.updateReceivingQc(sample?.id, {
          receiving_qc_status: qcReceivingStatus,
        });
        toast.success(data?.message);
        setIsOpenReceivingQcModal(false);
        navigate(-1, { replace: true });
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
        setIsOpenReceivingQcModal(false);
        navigate(-1, { replace: true });
      }
    };

    if (!qcReceivingStatus) {
      return;
    }

    updateReceivingQcStatus();
  }, [qcReceivingStatus]);

  /* ========== Move To Next Department ========== */

  useEffect(() => {
    const moveToNextDepartment = async () => {
      try {
        const { data } = await sampleService.moveToNextDepartment(sample?.id);
        toast.success(data?.message);
        setIsOpenMoveToNextDepartmentModal(false);
        navigate(-1, { replace: true });
      } catch (error) {
        setIsOpenMoveToNextDepartmentModal(false);
        console.log(error);
        toast.warning(error?.response?.data?.message);
        navigate(-1, { replace: true });
      }
    };

    if (!moveToNextDepartmentState) {
      return;
    }

    moveToNextDepartment();
  }, [moveToNextDepartmentState]);

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
              {t("samplesManagement.sampleProfile.mainInfoData.title")}
            </p>
            <div className={`flex flex-row flex-wrap items-center gap-2`}>
              {/* Move To Next Department */}
              {sample &&
                sample?.process_status !== "completed" &&
                sample?.master_step?.current_step?.step_code !==
                  "RECEIVING_QC" &&
                sample?.master_step?.is_final_step !== 1 && (
                  <button
                    onClick={() => setIsOpenMoveToNextDepartmentModal(true)}
                    className={`px-8 py-3 flex flex-row items-center gap-2 bg-second-color text-primary-color hover:bg-primary-color hover:text-white rounded-2xl hover:scale-95 transition-all`}
                  >
                    <FaArrowsSplitUpAndLeft />
                    {t(
                      "samplesManagement.sampleProfile.mainInfoData.moveToNextDepartment",
                    )}
                  </button>
                )}
              {/* OPEN BIO_BANKING FORM */}
              {sample &&
                sample?.process_status !== "completed" &&
                sample?.master_step?.is_final_step === 1 && (
                  <Link to={"/dashboard/bio-banking/add"}>
                    <button
                      className={`px-8 py-3 flex flex-row items-center gap-2 bg-second-color text-primary-color hover:bg-primary-color hover:text-white rounded-2xl hover:scale-95 transition-all`}
                    >
                      <IoDocument />
                      {t(
                        "samplesManagement.sampleProfile.mainInfoData.openBioBankingProcess",
                      )}
                    </button>
                  </Link>
                )}
              {/* RECEIVING QC STATUS */}
              {sample &&
                sample?.process_status !== "completed" &&
                sample?.master_step?.current_step?.step_code ===
                  "RECEIVING_QC" && (
                  <button
                    onClick={() => setIsOpenReceivingQcModal(true)}
                    className={`px-8 py-3 flex flex-row items-center gap-2 bg-second-color text-primary-color hover:bg-primary-color hover:text-white rounded-2xl hover:scale-95 transition-all`}
                  >
                    <BiTestTube />
                    {t(
                      "samplesManagement.sampleProfile.mainInfoData.updateReceivingQcStatus",
                    )}
                  </button>
                )}
            </div>
          </div>

          {/* Barcode */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiBarcode className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("samplesManagement.sampleProfile.mainInfoData.barcode")}
              </p>
            </div>
            <div>
              <p className={`text-base font-semibold text-black/40`}>
                {sample?.barcode}
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
                {t("samplesManagement.sampleProfile.mainInfoData.testType")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {sample?.test_type?.code}
            </p>
          </div>

          {/* BarCode */}
          <div className={`flex flex-col gap-4`}>
            <div
              className={`w-64 cursor-pointer`}
              onClick={() => setIsOpenPrintBarcodeModal(true)}
            >
              <Barcode
                value={sample?.barcode}
                className={`w-full h-16`}
                lineColor={sample?.receiving_qc_status === "fail" && "#EA7B7B"}
              />
            </div>
          </div>

          {/* Process Status */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <FaLinesLeaning className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t(
                  "samplesManagement.sampleProfile.mainInfoData.processStatus",
                )}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 ${spanColoring(sample?.sample_condition)}`}
            >
              {sample?.process_status}
            </p>
          </div>

          {/* Received From */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiBuilding className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t(
                  "samplesManagement.sampleProfile.mainInfoData.received_from",
                )}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {sample?.received_from}
            </p>
          </div>

          {/* Received By */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiUser className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t("samplesManagement.sampleProfile.mainInfoData.received_by")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {sample?.received_by}
            </p>
          </div>

          {/* Current Step */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiStopCircle className={`text-xl`} />
              </div>

              <p className={`text-xl text-black/80`}>
                {t("samplesManagement.sampleProfile.mainInfoData.currentStep")}
              </p>
            </div>
            <div className={`flex flex-row items-center gap-2`}>
              <p
                className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 ${spanColoring(sample?.sample_condition)}`}
              >
                {sample?.master_step?.current_step?.step_code}
              </p>
              {sample &&
                !sample?.master_step?.test_result?.find(
                  (tr) =>
                    tr.step_id === sample?.master_step?.current_step?.id &&
                    tr.step_status === "pass",
                ) && (
                  <button
                    onClick={() => setIsOpenAddTestResultsModal(true)}
                    className={`border rounded-full px-2 py-2 hover:bg-primary-color/30 border-primary-color text-primary-color flex items-center gap-2 text-xs font-semibold`}
                  >
                    <IoInformationCircle className={`text-xl`} />
                    اضافة نتائج للخطوة الحالية
                  </button>
                )}
            </div>
          </div>

          {/* Current Department */}
          <div className={`flex flex-col gap-4`}>
            <div className={`flex flex-row items-center gap-2`}>
              <div
                className={`w-8 h-8 bg-slate-100 rounded-full flex justify-center items-center`}
              >
                <BiDoorOpen className={`text-xl`} />
              </div>
              <p className={`text-xl text-black/80`}>
                {t(
                  "samplesManagement.sampleProfile.mainInfoData.currentDepartment",
                )}
              </p>
            </div>

            <p
              className={`text-xs font-semibold w-fit px-2 py-1 rounded-full opacity-90 hover:opacity-100 ${spanColoring(sample?.sample_condition)}`}
            >
              {sample?.department?.department_code}
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
                {t("samplesManagement.sampleProfile.mainInfoData.created_at")}
              </p>
            </div>

            <p className={`text-base font-semibold text-black/40`}>
              {formattedDate(sample?.created_at).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="w-full bg-white rounded-xl shadow-md flex flex-col p-4 gap-4">
          <p className={`text-2xl font-semibold`}>
            {t("samplesManagement.sampleProfile.workflowLogs.title")}
          </p>
          <div className={`flex flex-col gap-4`}>
            {sample?.sampleWorkflowLogs?.map((log, index) => (
              <div key={index} className={`flex flex-row items-center gap-2`}>
                <div
                  className={`w-14 h-14 bg-primary-color text-white rounded-full flex items-center justify-center`}
                >
                  {index + 1}
                </div>
                <div
                  className={`bg-white p-2 w-full border-r-8 flex flex-col gap-4 text-3xl rounded-2xl shadow border-r-primary-color`}
                >
                  <p className={`text-xl font-semibold`}>
                    {log?.from_step?.step_code}
                  </p>
                  <div className={`flex flex-row items-center gap-40`}>
                    <p className={`text-lg font-normal flex gap-2`}>
                      الحالة :
                      <span
                        className={`px-2 py-1 text-xs rounded-lg ${spanColoring(
                          log?.to_process_status
                            ? log?.to_process_status
                            : log?.from_process_status,
                        )}`}
                      >
                        {log?.to_process_status
                          ? log?.to_process_status
                          : log?.from_process_status}
                      </span>
                    </p>
                    <p className={`text-lg font-normal flex gap-2`}>
                      التاريخ :
                      <span className={`text-black/40`}>
                        {formatArabicDate(
                          log?.from_step?.created_at,
                        ).toLocaleDateString("ar-EG", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* Log Card */}
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {isOpenPrintBarcodeModal && (
        <Modal onClose={() => setIsOpenPrintBarcodeModal(false)}>
          <div className={`flex flex-col gap-4 items-center justify-center`}>
            <Barcode value={sample?.barcode} className={``} />

            <button
              className={`w-full print:hidden py-3 flex flex-row items-center justify-center gap-2 bg-primary-color text-white rounded-2xl hover:scale-95 transition-all`}
              onClick={() => print()}
            >
              <BsPrinter />
              {t("samplesManagement.sampleProfile.mainInfoData.printBarcode")}
            </button>
          </div>
        </Modal>
      )}

      {/* Update Receiving Qc Modal */}
      {isOpenReceivingQcModal && (
        <Modal onClose={() => setIsOpenReceivingQcModal(false)}>
          <div className={`flex flex-col gap-4 items-center justify-center`}>
            <div
              className={`w-16 h-16 bg-primary-color/20 flex justify-center items-center rounded-full`}
            >
              <BiScan className={`text-4xl text-primary-color`} />
            </div>
            <p className={`text-3xl font-semibold`}>تحديث حالة اختبار الجودة</p>
            <p className={`text-sm text-black/40`}>
              قم بإختيار حالة اختبار الجودة الخاص بالعينة{" "}
              <span className={`font-black text-primary-color`}>
                {sample?.barcode}
              </span>
            </p>
            <div
              className={`w-full flex flex-row items-center justify-center gap-4`}
            >
              <button
                onClick={() => {
                  console.log("fail");
                  setQcReceivingStatus("fail");
                }}
                className={`w-fit px-8 h-12 text-xl flex flex-row items-center gap-2 bg-red-600 text-white hover:bg-red-700 rounded-2xl hover:scale-95 transition-all`}
              >
                <BiXCircle className={`text-2xl`} />
                FAIL
              </button>
              <button
                onClick={() => {
                  console.log("pass");

                  setQcReceivingStatus("pass");
                }}
                className={`w-fit px-8 h-12 text-xl flex flex-row items-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-2xl hover:scale-95 transition-all`}
              >
                <BiCheckCircle className={`text-2xl`} />
                PASS
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Move To Next Department Modal */}
      {isOpenMoveToNextDepartmentModal && (
        <Modal onClose={() => setIsOpenMoveToNextDepartmentModal(false)}>
          <div className={`flex flex-col gap-4 items-center justify-center`}>
            <div
              className={`w-16 h-16 bg-primary-color/20 flex justify-center items-center rounded-full`}
            >
              <BsBoxArrowLeft className={`text-4xl text-primary-color`} />
            </div>
            <p className={`text-3xl font-semibold`}>
              هل أنت متأكد من الأنتقال للقسم التالي ؟
            </p>
            <p className={`text-sm max-w-xl text-black/40 text-center`}>
              عند التأكيد للأنتقال للقسم الأخر سيتم نقل العينة من القسم الحالي
              للقسم التالي لنوع الأختبار , ولا تتمكن من الرجوع إليه مرة أخرى
            </p>
            <div
              className={`w-full flex flex-row items-center justify-center gap-4`}
            >
              <button
                onClick={() => {
                  setIsOpenMoveToNextDepartmentModal(false);
                }}
                className={`w-fit px-8 h-12 text-xl flex flex-row items-center gap-2 bg-red-600 text-white hover:bg-red-700 rounded-2xl hover:scale-95 transition-all`}
              >
                <BiXCircle className={`text-2xl`} />
                {t("global.no")}
              </button>
              <button
                onClick={() => {
                  setMoveToNextDepartmentState("yes");
                }}
                className={`w-fit px-8 h-12 text-xl flex flex-row items-center gap-2 bg-green-600 text-white hover:bg-green-700 rounded-2xl hover:scale-95 transition-all`}
              >
                <BiCheckCircle className={`text-2xl`} />
                {t("global.yes")}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Test Results Modal */}
      {isOpenAddTestResultsModal && (
        <Modal onClose={() => setIsOpenAddTestResultsModal(false)}>
          <div className={`flex flex-col gap-4 items-center justify-center`}>
            <div
              className={`w-16 h-16 bg-primary-color/20 flex justify-center items-center rounded-full`}
            >
              <BsBoxArrowLeft className={`text-4xl text-primary-color`} />
            </div>
            <p className={`text-3xl font-semibold flex items-center gap-2`}>
              إضافة نتيجة لخطوة الأختبار الحالية
              <span className={`font-semibold text-primary-color`}>
                {sample?.master_step?.current_step?.step_code}
              </span>
            </p>
            <p className={`text-sm max-w-xl text-black/40 text-center`}>
              عند إضافة نتيجة للخطوة الحالية لا يعني إنهاء خطوة الاختبار الإ إذا
              قمت بتحديد أن الحالة الحالية هي pass
            </p>
            <div>
              <form
                className={`w-full flex flex-col gap-4`}
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className={`flex flex-col gap-2`}>
                  <label className="block mb-1">حالة الخطوة الحالية</label>
                  <select
                    className="w-full border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                    {...register(`step_status`)}
                  >
                    <option value="pass">pass</option>
                    <option value="fail">fail</option>
                    <option value="in_progress">in_progress</option>
                  </select>
                </div>

                <div className={`flex flex-col gap-2`}>
                  <label className="block mb-1">نتائج للخطوة الحالية</label>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-5 gap-4 justify-between items-center"
                    >
                      <input
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                        placeholder="key"
                        {...register(`results.${index}.key`)}
                      />

                      <select
                        className="w-full border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                        {...register(`results.${index}.type`)}
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        {/* <option value="json">JSON</option> */}
                      </select>

                      <input
                        className="w-full col-span-2 border rounded-md px-4 py-2 focus:outline-none focus:shadow"
                        placeholder="value"
                        {...register(`results.${index}.value`)}
                      />

                      <button
                        className={`w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center `}
                        type="button"
                        onClick={() => remove(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div
                  className={`w-full flex flex-row gap-4  justify-center items-center`}
                >
                  <button
                    className="px-4 py-2 bg-grey-2 text-grey-5 rounded-md hover:scale-95 transition-all"
                    type="button"
                    onClick={() =>
                      append({ key: "", type: "string", value: "" })
                    }
                  >
                    إضافة حقل نتيجة جديد
                  </button>

                  <button
                    className="px-4 py-2 bg-primary-color text-white rounded-md hover:scale-95 transition-all"
                    type="submit"
                  >
                    إرسال
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default MainData;
