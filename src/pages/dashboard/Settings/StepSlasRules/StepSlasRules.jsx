import React, { useMemo, useState } from "react";

import BreedCrump from "../../../../components/ui/BreedCrump";
import DataTable from "../../../../components/dataTable/DataTable";
import formatArabicDate from "../../../../utils/formatArabicDate";
import { useTranslation } from "react-i18next";
import Filters from "../../../../components/filters/Filter";
import { FaFileArrowDown } from "react-icons/fa6";
import { BiBlock, BiPencil, BiPlus } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../../../components/modals/Modal";
import { toast } from "react-toastify";
import { handleBulk } from "../../../../utils/handleBulkActions";
import CheckUserPermission from "../../../../middlewares/CheckUserPermission";
import hasAnyPermission from "../../../../hooks/permissions/hasAnyPermission";
import useWorkflowSteps from "../../../../hooks/workflowSteps/useWorkflowSteps";
import { workflowStepsService } from "../../../../services/workflowSteps/workflowStepsService";
import { masterStepsService } from "../../../../services/masterSteps/masterStepsService";
import { testCodesService } from "../../../../services/testCodesService/testCodesService";
import { departmentsService } from "../../../../services/departments/departmentsService";
import { stepSlasRulesService } from "../../../../services/stepSlasRules/stepSlasRulesService";
import useStepSlasRules from "../../../../hooks/stepSlasRules/useStepSlasRules";

const StepSlasRules = () => {
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);
  const { user } = useSelector((state) => state.auth);
  const formattedDate = formatArabicDate;
  const {
    stepSlasRules,
    error,
    loading,
    filters,
    pagination,
    refetchStepSlasRules,
    setFilters,
    setPage,
    exportSheet,
  } = useStepSlasRules();
  const navigate = useNavigate();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [departmentsOptions, setDepartmentsOptions] = useState([]);
  const [masterStepsOptions, setMasterStepsOptions] = useState([]);
  const [testTypesOptions, setTestTypesOptions] = useState([]);

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

  /** Columns */
  const COLUMNS = [
    { header: "#", accessor: "id" },
    {
      header: t("stepSlasRulesManagement.stepSlasRulesTable.testType"),
      accessor: (row) => (
        <span>{row?.test_type?.code + " - " + row?.test_type?.name}</span>
      ),
    },
    {
      header: t("stepSlasRulesManagement.stepSlasRulesTable.department"),
      accessor: (row) => (
        <span>
          {row?.department?.department_code +
            " - " +
            row?.department?.department_name}
        </span>
      ),
    },
    {
      header: t("stepSlasRulesManagement.stepSlasRulesTable.masterStep"),
      accessor: (row) => (
        <span>
          {row?.master_step?.step_code + " - " + row?.master_step?.step_name}
        </span>
      ),
    },
    {
      header: t("stepSlasRulesManagement.stepSlasRulesTable.slaMinutes"),
      accessor: "sla_minutes",
    },
    {
      header: t("stepSlasRulesManagement.stepSlasRulesTable.warningMinutes"),
      accessor: "warning_minutes",
    },
    {
      header: t("stepSlasRulesManagement.stepSlasRulesTable.date"),
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
      key: "department_id",
      label: "القسم",
      type: "radio",
      options: departmentsOptions,
    },
    {
      key: "master_step_id",
      label: "الخطوة",
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

  /** onDelete */
  const onDelete = async (selected) => {
    try {
      console.log(selected);
      const res = await stepSlasRulesService.deleteStepRule(selected.id);
      toast.success(
        t("stepSlasRulesManagement.deleteStepSlasRuleSuccessStatus"),
      );
      refetchStepSlasRules();
      setIsOpenDeleteModal(false);
    } catch (error) {
      console.log(error);
      toast.error(t("global.errorProcessingRequest"));
      setIsOpenDeleteModal(false);
    }
  };

  /** handleBulk */
  const handleBulkAction = (ids, actionType) => {
    handleBulk({
      serviceObject: stepSlasRules,
      serviceMethod: "bulkActions",
      actionType: actionType,
      params: [ids, actionType],
      onSuccess: (data) => {
        toast.success(data?.message);
        refetchStepSlasRules();
      },
      onError: (error) => toast.error(error?.message),
    });
  };

  return (
    <>
      <div className={`w-full flex flex-col gap-4`}>
        <BreedCrump breed_title={t("layouts.sideBar.settings.stepSlasRules")} />

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

            <Filters
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
              <CheckUserPermission allowedPermission={"test_codes.export"}>
                <div className="flex gap-2">
                  <button
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg border border-green-600 hover:bg-green-600 hover:text-white transition text-green-500`}
                    onClick={() => exportSheet(selectedRows)}
                  >
                    <FaFileArrowDown
                      className="w-5 h-5"
                      title={`${lang === "en" ? "Export Step Slas Rules CSV Sheet" : "تصدير شيت تعريف توقيتات الخطوات للاختبارات"}`}
                    />{" "}
                    {t("global.download")}
                  </button>
                </div>
              </CheckUserPermission>

              <CheckUserPermission allowedPermission={"workflow_steps.create"}>
                <Link
                  to={"add"}
                  className={`flex items-center gap-1 px-4 py-2 text-white rounded-lg bg-primary-color`}
                >
                  <BiPlus className="w-5 h-5" />
                  {t("workflowStepsManagement.addWorkflowStep")}
                </Link>
              </CheckUserPermission>
            </div>
          </div>
          <DataTable
            columns={COLUMNS}
            data={stepSlasRules}
            loading={loading}
            selected_rows={selectedRows}
            onChangeSelected={setSelectedRows}
            onPageChange={setPage}
            pagination={pagination}
            renderRowActions={(row) => {
              const canAnyPermission = hasAnyPermission(
                user?.permissions,
                ["workflow_steps.edit", "workflow_steps.delete"],
                user?.role?.name?.toLowerCase(),
              );
              return (
                canAnyPermission && (
                  <div className={`flex flex-row gap-2 items-center`}>
                    <CheckUserPermission
                      allowedPermission={"workflow_steps.edit"}
                    >
                      <Link
                        to={`${row.id}/edit`}
                        className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                        state={row}
                      >
                        <BiPencil
                          title={`${lang === "en" ? "Edit" : "تعديل"}`}
                        />
                      </Link>
                    </CheckUserPermission>
                    <CheckUserPermission
                      allowedPermission={"workflow_steps.delete"}
                    >
                      <button
                        className={`w-8 h-8 text-xl rounded-lg bg-grey-2 text-grey-1 flex items-center justify-center hover:bg-grey-5 transition`}
                        onClick={() => {
                          console.log(row);
                          setSelectedRow({ id: row.id, name: row.name });
                          setIsOpenDeleteModal(true);
                        }}
                      >
                        <BiBlock
                          title={`${lang === "en" ? "Delete" : "حذف"}`}
                        />
                      </button>
                    </CheckUserPermission>
                  </div>
                )
              );
            }}
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

export default StepSlasRules;
