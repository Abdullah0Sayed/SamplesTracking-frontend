import React, { useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import { FaFileArrowDown } from "react-icons/fa6";
import { BiBlock, BiPencil, BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BsEye } from "react-icons/bs";
import formatArabicDate from "../../../utils/formatArabicDate";
import useDepartments from "../../../hooks/departments/useDepartments";
import { departmentsService } from "../../../services/departments/departmentsService";
import BreedCrump from "../../../components/ui/BreedCrump";
import Filter from "../../../components/filters/Filter";
import CheckUserPermission from "../../../middlewares/CheckUserPermission";
import DataTable from "../../../components/dataTable/DataTable";
import hasAnyPermission from "../../../hooks/permissions/hasAnyPermission";
import Modal from "../../../components/modals/Modal";
import { handleBulk } from "../../../utils/handleBulkActions";
import useQueues from "../../../hooks/queues/useQueues";
import { queuesService } from "../../../services/queues/queuesService";
import { masterStepsService } from "../../../services/masterSteps/masterStepsService";
import { testCodesService } from "../../../services/testCodesService/testCodesService";

const Queues = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const { user } = useSelector((state) => state.auth);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const [testTypesOptions, setTestTypesOptions] = useState([]);
  const [masterStepsOptions, setMasterStepsOptions] = useState([]);
  const formattedDate = formatArabicDate;
  const {
    sampleQueues,
    error,
    loading,
    filters,
    pagination,
    refetchSampleQueues,
    setFilters,
    setPage,
  } = useQueues();

  const navigate = useNavigate();
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  /** Columns */
  const COLUMNS = [
    { header: "#", accessor: "id" },
    {
      header: t("queuesManagement.queues_table.barcode"),
      accessor: "barcode",
    },
    {
      header: t("queuesManagement.queues_table.department"),
      accessor: "department",
    },
    {
      header: t("queuesManagement.queues_table.current_step"),
      accessor: "current_step",
    },
    {
      header: t("queuesManagement.queues_table.queue_name"),
      accessor: "queue_name",
    },
    {
      header: t("queuesManagement.queues_table.counts_for_same_test_type"),
      accessor: "counts_for_same_test_type",
    },
    {
      header: t("queuesManagement.queues_table.workflow_started_at"),
      accessor: (row) =>
        row.workflow_started_at
          ? formattedDate(row.workflow_started_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "-",
    },
    {
      header: t("queuesManagement.queues_table.current_step_started_at"),
      accessor: (row) =>
        row.current_step_started_at
          ? formattedDate(row.current_step_started_at).toLocaleDateString(
              "ar-EG",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              },
            )
          : "-",
    },
    {
      header: t("queuesManagement.queues_table.date"),
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

  const loadDepartments = useMemo(async () => {
    try {
      const { data } =
        await departmentsService.getAllDepartmentsWithoutPagination();
      setDepartmentsOptions(
        data?.data?.map((department) => ({
          label: department.department_code,
          value: department.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadMasterSteps = useMemo(async () => {
    try {
      const { data } =
        await masterStepsService.getAllMasterStepsWithoutPagination();
      setMasterStepsOptions(
        data?.data?.map((masterStep) => ({
          label: masterStep.step_code,
          value: masterStep.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const loadTestTypes = useMemo(async () => {
    try {
      const { data } =
        await testCodesService.getAllTestCodesWithoutPagination();
      setTestTypesOptions(
        data?.data?.map((testType) => ({
          label: testType.code,
          value: testType.id,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, []);

  const FILTER_GROUPS = [
    {
      key: "sorted_by",
      label: "الترتيب حسب",
      type: "radio",
      options: [
        { value: "", label: "الكل" },
        { value: "name", label: "الأسم" },
        { value: "newest", label: "الأحدث أولاً" },
        { value: "oldest", label: "الأقدم أولاً" },
      ],
    },
    {
      key: "current_department_id",
      label: "القسم",
      type: "radio",
      options: departmentsOptions,
    },
    {
      key: "current_step_id",
      label: "الخطوة الحالية",
      type: "radio",
      options: masterStepsOptions,
    },
    {
      key: "test_type_id",
      label: "نوع الأختبار",
      type: "radio",
      options: testTypesOptions,
    },
  ];

  /** selected rows */
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState({ id: "", name: "" });

  /** handleBulk */
  const handleBulkAction = (ids, actionType) => {
    handleBulk({
      serviceObject: sampleQueues,
      serviceMethod: "bulkActions",
      actionType: actionType,
      params: [ids, actionType],
      onSuccess: (data) => {
        toast.success(data?.message);
        refetchSampleQueues();
      },
      onError: (error) => toast.error(error?.message),
    });
  };

  return (
    <>
      <div className={`w-full flex flex-col gap-4`}>
        <BreedCrump breed_title={t("layouts.sideBar.settings.queues")} />

        <div className={`bg-white shadow-md rounded-2xl flex flex-col gap-2`}>
          <div
            className={`w-full flex flex-row justify-between items-center flex-wrap p-4`}
          >
            {/* {
                            selectedRows.length === 0 ? (<Filters filterGroups={FILTER_GROUPS} onFilterChange={setFilters} onSearchChange={(val) => setFilters(prev => ({ ...prev, search: val }))}
                                filtersFromModel={filters} isSearchEnabled={true} searchText={filters.search} isFiltersEnabled={true} />
                            ) : <div className={`flex flex-row gap-2 text-grey-5 items-center`}>
                                <span>{t('global.selected')} {selectedRows.length}</span>
                                <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}

                                >
                                    <BsEye title={`${lang === 'en' ? 'active Toggle' : 'تبديل النشاط'}`}

                                        onClick={() => handleBulkAction(selectedRows, 'activationToggle')}
                                    />
                                </button>
                                <button className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}

                                >
                                    <BiBlock title={`${lang === 'en' ? 'block users' : 'حظر المستخدمين'}`} onClick={() => handleBulkAction(selectedRows, 'block')} />
                                </button>
                            </div>
                        } */}

            <Filter
              filterGroups={FILTER_GROUPS}
              onFilterChange={setFilters}
              onSearchChange={(val) =>
                setFilters((prev) => ({ ...prev, search: val }))
              }
              filtersFromModel={filters}
              isSearchEnabled={true}
              searchText={filters.search}
              isFiltersEnabled={true}
            />

            <div className="flex gap-2">
              {/* <CheckUserPermission allowedPermission={"test_codes.export"}>

                                <div className="flex gap-2">
                                    <button
                                        className={`flex items-center gap-1 px-4 py-2 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white transition text-green-500`}
                                        onClick={() => handleBulkAction(selectedRows, 'export')}>
                                        <FaFileArrowDown className="w-5 h-5" title={`${lang === 'en' ? 'Export Admins CSV Sheet' : 'تصدير شيت المسؤلين'}`} /> {t('global.download')}
                                    </button>
                                </div>
                            </CheckUserPermission> */}
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={sampleQueues}
            loading={loading}
            selected_rows={selectedRows}
            onChangeSelected={setSelectedRows}
            onPageChange={setPage}
            pagination={pagination}
            renderRowActions={false}
          />
        </div>
      </div>

      {/* Modal */}
      {isOpenDeleteModal && (
        <Modal onClose={() => setIsOpenDeleteModal(false)}>
          <div
            className={`bg-white rounded-2xl flex flex-col justify-center items-center gap-4`}
          >
            <p className={`text-base font-semibold`}>
              {t("global.areYouSureDelete")} {selectedRow.name}{" "}
              {lang === "en" ? "?" : "؟"}
            </p>
            <div
              className={`w-full flex flex-row justify-center items-center gap-4`}
            >
              <button
                className={`px-4 py-2 bg-grey-2 text-grey-5 rounded-md text-center hover:scale-95 transition-all`}
                type="button"
                onClick={() => setIsOpenDeleteModal(false)}
              >
                {t("global.cancel")}
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded-md text-center hover:scale-95 transition-all`}
                type="button"
                onClick={() => onDelete(selectedRow)}
              >
                {t("global.save")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Queues;
