import React, { useEffect, useMemo, useState } from "react";
import DataTable from "../../../dataTable/DataTable";
import { useTranslation } from "react-i18next";
import formatArabicDate from "../../../../utils/formatArabicDate";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { BiBlock, BiEdit, BiPencil } from "react-icons/bi";
import Modal from "../../../modals/Modal";
import Form from "../../../forms/Form";
import { sampleTestStatusService } from "../../../../services/sampleTestStatus/sampleTestStatusService";
import { toast } from "react-toastify";

const SampleTestSteps = ({ SampleTests = [] }) => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const formattedDate = formatArabicDate;
  const [loading, setLoading] = useState(true);
  /** selected rows */
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const navigate = useNavigate();
  /** fetch id from route params */
  const { id } = useParams();
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
        color = "bg-green-200 text-green-600";
        break;
      case "rejected":
      case "canceled":
        color = "bg-red-200 text-red-600";
        break;
      case "pending":
        color = "bg-gray-200 text-gray-600";
        break;
    }

    return color;
  };

  /** Edit Modal */
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /** Columns */
  const COLUMNS = [
    { header: "#", accessor: "id" },
    {
      header: t("samplesManagement.sample_tests_status_table.test_code"),
      accessor: "step_code",
    },
    {
      header: t("samplesManagement.sample_tests_status_table.results"),
      accessor: "results",
    },
    {
      header: t("samplesManagement.sample_tests_status_table.notes"),
      accessor: "notes",
    },
    {
      header: t("samplesManagement.sample_tests_status_table.status"),
      accessor: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${spanColoring(row.current_status)}`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: t("samplesManagement.sample_tests_status_table.created_by"),
      accessor: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs }`}>
          {row.created_by}
        </span>
      ),
    },

    {
      header: t("samplesManagement.sample_tests_status_table.performed_at"),
      accessor: (row) =>
        lang === "ar"
          ? formattedDate(row.created_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : formattedDate(row.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
    },
  ];

  const sampleTestStatusOptions = [
    { label: "pending", value: "pending" },
    { label: "running", value: "running" },
    { label: "done", value: "done" },
    { label: "canceled", value: "canceled" },
  ];

  /** Update Sample Test Status Fields */
  const SAMPLE_TEST_STATUS_FIELDS = useMemo(
    () => [
      {
        name: "status",
        type: "single-select",
        placeholder: t(
          "samplesManagement.samplesTestsStatusFields.statusPlaceholder",
        ),
        label: t("samplesManagement.samplesTestsStatusFields.status"),
        options: sampleTestStatusOptions,
        validation: {
          required: "حالة الإختبار مطلوبة",
        },
      },
      {
        name: "result_file",
        type: "file",
        placeholder: t(
          "samplesManagement.samplesTestsStatusFields.resultFilePlaceholder",
        ),
        label: t("samplesManagement.samplesTestsStatusFields.resultFile"),
      },
      {
        name: "results",
        type: "textArea",
        placeholder: t(
          "samplesManagement.samplesTestsStatusFields.descriptionPlaceholder",
        ),
        label: t("samplesManagement.samplesTestsStatusFields.description"),
      },
      {
        name: "notes",
        type: "textArea",
        placeholder: t(
          "samplesManagement.samplesTestsStatusFields.notesPlaceholder",
        ),
        label: t("samplesManagement.samplesTestsStatusFields.notes"),
      },
    ],
    [t],
  );

  /** INITIAL VALUES FOR TEST STATUS FIELDS */
  const SAMPLE_TEST_STATUS_INITIAL_VALUES = useMemo(
    () => ({
      sample_id: id,
      sample_test_id: selectedRow?.id,
      status: selectedRow?.status || "",
      results: selectedRow?.results || "",
      notes: selectedRow?.notes || "",
      result_file: null,
    }),
    [selectedRow],
  );

  /** OnSubmit Test Status Form */
  const onSubmit = async (data) => {
    try {
      console.log(`Sample ID : ${data.sample_id}`);
      console.log(`Sample Test ID : ${data.sample_test_id}`);
      const formData = new FormData();

      formData.append("sample_id", Number(data.sample_id));
      formData.append("sample_test_id", data.sample_test_id);
      formData.append("status", data.status);
      formData.append("results", data.results);
      formData.append("notes", data.notes);
      if (data.result_file && data.result_file.length > 0) {
        formData.append("result_file", data.result_file[0]);
      }

      const payload = {
        sample_id: formData.get("sample_id"),
        sample_test_id: formData.get("sample_test_id"),
        status: formData.get("status"),
        results: formData.get("results"),
        notes: formData.get("notes"),
        result_file: data.result_file ? formData.get("result_file") : null,
      };
      console.log(payload);
      const res = await sampleTestStatusService.updateSampleTestStatus(payload);
      console.log(res);
      toast.success(t("global.successUpdateProcessingRequest"));
      setIsEditModalOpen(false);
      navigate(-1);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (SampleTests.length > 0) setLoading(false);
  }, [SampleTests]);
  return (
    <>
      <div className="w-full">
        <DataTable
          columns={COLUMNS}
          data={SampleTests}
          loading={loading}
          selected_rows={selectedRows}
          onChangeSelected={setSelectedRows}
          renderRowActions={(row) => (
            <div className={`flex flex-row gap-2 items-center`}>
              <button
                className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                onClick={() => {
                  console.log(row);
                  setSelectedRow(row);
                  setIsEditModalOpen(true);
                }}
              >
                <BiEdit
                  title={`${lang === "en" ? "Update Test Status" : "تحديث حالة الاختبار"}`}
                />
              </button>
            </div>
          )}
        />
      </div>

      {/* Modal */}

      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className={`w-full flex flex-col gap-4`}>
            <p className={`text-lg font-semibold`}>
              {t("samplesManagement.editSampleTestStatus")}{" "}
              {selectedRow.test_code}{" "}
            </p>

            <Form
              fields={SAMPLE_TEST_STATUS_FIELDS}
              gridLayout="grid-cols-2"
              initial_values={SAMPLE_TEST_STATUS_INITIAL_VALUES}
              submit_label={t("global.update")}
              showCancelBtn={false}
              onSubmit={onSubmit}
            />
          </div>
        </Modal>
      )}
    </>
  );
};

export default SampleTestSteps;
