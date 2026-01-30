import { BsGrid, BsPatchQuestion, BsSave, BsStack } from "react-icons/bs";
import { BiUserCircle, BiDonateBlood, BiGroup } from "react-icons/bi";
import { FiSave, FiSettings } from "react-icons/fi";
import { FaFlask, FaMicroscope, FaServicestack } from "react-icons/fa6";
import { IoPlayForwardCircle } from "react-icons/io5";

const sidebarItems = [
  {
    label: "layouts.sideBar.controlPanel",
    icon: BsGrid,
    to: "/dashboard",
    exact: true,
  },
  {
    label: "layouts.sideBar.accounts.heading",
    icon: BiGroup,
    children: [
      { label: "layouts.sideBar.accounts.admins", to: "accounts/admins" },
      { label: "layouts.sideBar.roles.title", to: "accounts/roles" },
    ],
  },
  {
    label: "layouts.sideBar.samples",
    icon: FaMicroscope,
    to: "samples",
  },
  {
    label: "layouts.sideBar.bioBankingManagement",
    icon: FiSave,
    to: "bio-banking",
  },
  {
    label: "layouts.sideBar.queuesManagement.title",
    icon: BsStack,
    to: "queues/all",

    // children: [
    //   {
    //     label: "layouts.sideBar.queuesManagement.queues",
    //   },
    //   {
    //     label: "layouts.sideBar.queuesManagement.overView",
    //     to: "queues/overview",
    //   },
    // ],
  },
  {
    label: "layouts.sideBar.settings.title",
    icon: FiSettings,
    children: [
      {
        label: "layouts.sideBar.settings.sampleCodes",
        to: "settings/sample-codes",
      },
      {
        label: "layouts.sideBar.settings.testCodes",
        to: "settings/test-codes",
      },
      {
        label: "layouts.sideBar.settings.departments",
        to: "settings/departments",
      },
      {
        label: "layouts.sideBar.settings.masterSteps",
        to: "settings/master-steps",
      },
      {
        label: "layouts.sideBar.settings.storageLocations",
        to: "settings/storage-locations",
      },
      {
        label: "layouts.sideBar.settings.workflowSteps",
        to: "settings/workflow-steps",
      },
      {
        label: "layouts.sideBar.settings.stepSlasRules",
        to: "settings/step-slas-rules",
      },

      // {
      //   label: "layouts.sideBar.settings.workflows",
      //   to: "settings/workflows",
      // },
      // {
      //   label: "layouts.sideBar.settings.laboratories",
      //   to: "settings/laboratories",
      // },
      // {
      //   label: "layouts.sideBar.settings.refrigerators",
      //   to: "settings/refrigerators",
      // },
      // {
      //   label: "layouts.sideBar.settings.freezers",
      //   to: "settings/freezers",
      // },
    ],
  },
];

export default sidebarItems;
