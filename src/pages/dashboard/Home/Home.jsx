import React, { useEffect, useRef, useState } from "react";
import { BiCoinStack, BiDollar, BiMoney, BiTransfer } from "react-icons/bi";
import CardStatic from "../../../components/home/CardStatic";
import { FaCoins } from "react-icons/fa6";
import { GiExpense } from "react-icons/gi";
import { CiMoneyBill } from "react-icons/ci";
import BreedCrump from "../../../components/ui/BreedCrump";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DateRangePicker from "../../../components/datePicker/DateRangePicker";
import { useTranslation } from "react-i18next";
import useDashboard from "../../../hooks/home/useDashboard";
import formatArabicDate from "../../../utils/formatArabicDate";
import DataTable from "../../../components/dataTable/DataTable";
import html2pdf from "html2pdf.js";
import { BsFilePdf } from "react-icons/bs";

const Home = () => {
  const [domIsLoaded, setDomIsLoaded] = useState(false);
  const { t } = useTranslation("global");
  const lang = useSelector((state) => state.webLanguage);

  const {
    samplesStatusNumericStats,
    latestActivities,
    sampleStatusPercentage,
    latestHandoff,
    activeWorkflows,
    sampleConditionsStats,
    sampleTrends,
    setFilters,
    loading,
    error,
  } = useDashboard();
  /** Columns */
  const COLUMNS = [
    { header: "#", accessor: "id", width: "80px" },
    {
      header: t("home.latestTransactions.description"),
      accessor: (row) => row?.description,
      width: "280px",
    },

    {
      header: t("home.latestTransactions.created_by"),
      accessor: (row) => row?.causer?.name,
      width: "150px",
    },

    {
      header: t("home.latestTransactions.causer_type"),
      accessor: (row) => row.subject_type?.split("\\").pop(),
      width: "150px",
    },
    {
      header: t("home.latestTransactions.event"),
      accessor: (row) => row.event,
      width: "220px",
    },

    {
      header: t("home.latestTransactions.date"),
      accessor: (row) =>
        lang === "ar"
          ? formatArabicDate(row.created_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : formatArabicDate(row.created_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
      width: "180px",
    },
  ];

  const HANDOFF_COLUMNS = [
    { header: "#", accessor: "id", width: "80px" },
    {
      header: t("home.latestHandoff.sample_barcode"),
      accessor: (row) => row?.sample?.barcode,
      width: "280px",
    },

    {
      header: t("home.latestHandoff.from_department"),
      accessor: (row) => row?.from_department?.department_code,
      width: "150px",
    },

    {
      header: t("home.latestHandoff.to_department"),
      accessor: (row) => row?.to_department?.department_code,
      width: "150px",
    },
    {
      header: t("home.latestHandoff.created_by"),
      accessor: (row) => row.created_by?.name,
      width: "220px",
    },

    {
      header: t("home.latestHandoff.transfer_at"),
      accessor: (row) =>
        lang === "ar"
          ? formatArabicDate(row.transfer_at).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : formatArabicDate(row.transfer_at).toLocaleDateString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
      width: "180px",
    },
  ];

  const pdfReportReference = useRef();

  const handleDownloadPDF = () => {
    const element = pdfReportReference.current;

    html2pdf()
      .set({
        margin: 0.5,
        filename: "dashboard-report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "in",
          format: "a3",
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };

  useEffect(() => {
    setDomIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log(samplesStatusNumericStats);
    }
  }, []);

  return (
    <div className={`w-full h-full`}>
      {/* Breed Crump */}
      <div className={`w-full flex flex-1 justify-between items-center`}>
        <BreedCrump breed_title={t("global.dashboard")} />
        <div className={`flex items-center flex-row gap-2`}>
          <DateRangePicker
            onChange={(dates) => {
              if (!dates) return;
              const [start_date, end_date] = dates;

              // فقط لو المستخدم اختار الـ end_date
              if (!end_date) return;

              setFilters((prev) => ({
                ...prev,
                start_date,
                end_date,
              }));
            }}
          />
          {!loading && (
            <button
              className={`px-2 py-2 flex flex-row items-center gap-1 hover:scale-95 transition-all bg-green-500 rounded-md text-white text-sm`}
              onClick={handleDownloadPDF}
            >
              <BsFilePdf className={`text-xl`} />
              {t("global.downloadReport")}
            </button>
          )}
        </div>
      </div>

      <div ref={pdfReportReference}>
        {/* Statics */}
        <div
          className={`w-full grid grid-cols-2 mobile:grid-cols-2 gap-2 rounded-3xl  my-4`}
        >
          <CardStatic
            card_bg_color={`bg-white rounded-xl shadow`}
            dataForChart={[{ count: 15 }, { count: 40 }, { count: 50 }]}
            card_static_value={samplesStatusNumericStats?.received_samples}
            card_static_measurement={t("global.berRangeOfTime")}
            card_static_title={t("home.receivedSamples")}
          />
          <CardStatic
            card_bg_color={`bg-white rounded-xl shadow`}
            dataForChart={[{ count: 10 }, { count: 22 }, { count: 56 }]}
            card_static_value={samplesStatusNumericStats?.inprogress_samples}
            card_static_measurement={t("global.berRangeOfTime")}
            card_static_title={t("home.inProgressSamples")}
          />
          <CardStatic
            card_bg_color={`bg-white rounded-xl shadow`}
            dataForChart={[{ count: 22 }, { count: 23 }, { count: 40 }]}
            card_static_value={samplesStatusNumericStats?.completed_samples}
            card_static_measurement={t("global.berRangeOfTime")}
            card_static_title={t("home.completedSamples")}
          />
          <CardStatic
            card_bg_color={`bg-white rounded-xl shadow`}
            dataForChart={[{ count: 8 }, { count: 96 }, { count: 22 }]}
            card_static_value={samplesStatusNumericStats?.canceled_samples}
            card_static_measurement={t("global.berRangeOfTime")}
            card_static_title={t("home.canceledSamples")}
          />
        </div>

        {/* Charts */}
        <div className={`w-full grid grid-cols-2 gap-4 my-4`}>
          <div
            className={`col-span-1 medScreen:col-span-6 mobile:col-span-12 smallScreen:col-span-12 bg-white rounded-2xl shadow-lg p-4`}
          >
            {/* Title + Legend */}
            <div className={`flex flex-row justify-between items-center mb-2`}>
              <div className={`flex flex-col gap-1`}>
                <p className={`text-black font-semibold`}>
                  {sampleStatusPercentage?.title || "حالة العينات"}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sampleStatusPercentage?.data || []}
                    dataKey="sample_percentage"
                    nameKey="sample_status_translated"
                    // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    isAnimationActive={true}
                  >
                    {sampleStatusPercentage?.data?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry?.sample_status_coloring || "#cccccc"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className={`col-span-1 medScreen:col-span-6 mobile:col-span-12 smallScreen:col-span-12 bg-white rounded-2xl shadow-lg p-4`}
          >
            {/* Title */}
            <div className={`flex flex-row justify-between items-center mb-2`}>
              <div className={`flex flex-col gap-1`}>
                <p className={`text-black font-semibold`}>
                  {sampleTrends?.title || "التغير في عدد العينات"}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleTrends?.data || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />

                  <Bar
                    dataKey="count"
                    name="عدد العينات"
                    radius={[6, 6, 0, 0]}
                    fill="#2563eb"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Last Transactions */}
        <div className={`mt-4 flex flex-col gap-4`}>
          <p className={`font-semibold text-2xl`}>
            {t("home.latestTransactions.title")}
          </p>
          <DataTable
            enableCheckBox={false}
            columns={COLUMNS}
            data={latestActivities}
            loading={loading}
          />
        </div>

        {/* Last Handoffs */}
        <div className={`mt-4 flex flex-col gap-4`}>
          <p className={`font-semibold text-2xl`}>
            {t("home.latestHandoff.title")}
          </p>
          <DataTable
            enableCheckBox={false}
            columns={HANDOFF_COLUMNS}
            data={latestHandoff}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
