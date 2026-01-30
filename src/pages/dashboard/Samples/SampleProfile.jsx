import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import ProfileLayout from "../../../components/ui/profile/ProfileLayout";
import MainData from "../../../components/ui/profile/Sample/MainData";
import SampleTestSteps from "../../../components/ui/profile/Sample/SampleTestSteps";
import SampleLogs from "../../../components/ui/profile/Sample/SampleLogs";
import { useParams } from "react-router-dom";
import useSamples from "../../../hooks/samples/useSamples";

const SampleProfile = () => {
  const { t } = useTranslation("global");
  const { id } = useParams();
  const { fetchSample } = useSamples();
  const [sample, setSample] = useState();

  const getSampleById = async (id) => {
    try {
      const { data } = await fetchSample(id);
      console.log(data.data);
      setSample(data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!id) return;
    getSampleById(id);
  }, [id]);

  const navLinks = [
    {
      title: t("samplesManagement.sampleProfile.mainInfo"),
      element: <MainData sample={sample} />,
    },
    // {
    //   title: t("samplesManagement.sampleProfile.sampleTestSteps"),
    //   element: <SampleTestSteps SampleTests={sample?.workflow_steps} />,
    // },
    {
      title: t("samplesManagement.sampleProfile.logs"),
      element: <SampleLogs sampleLogs={sample?.sampleWorkflowLogs} />,
    },
  ];

  return (
    <ProfileLayout
      pageTitle={t("samplesManagement.editSampleData")}
      navLinks={navLinks}
    />
  );
};

export default SampleProfile;
