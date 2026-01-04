import { BsGrid } from "react-icons/bs";
import { BiUserCircle, BiDonateBlood } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { FaFlask } from "react-icons/fa6";

const sidebarItems = [
  {
    label: "layouts.sideBar.controlPanel",
    icon: BsGrid,
    to: "/dashboard",
  },
  {
    label: "layouts.sideBar.accounts.heading",
    icon: BiUserCircle,
    children: [
      { label: "layouts.sideBar.accounts.admins", to: "accounts/admins" },
      { label: "layouts.sideBar.roles.title", to: "accounts/roles" },
    ],
  },
  {
    label: "layouts.sideBar.samples",
    icon: FaFlask,
    to: "samples",
  },
  {
    label: "layouts.sideBar.bioBankingManagement",
    icon: BiDonateBlood,
    to: "bio-banking",
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
        label: "layouts.sideBar.settings.workflows",
        to: "settings/workflows",
      },
      {
        label: "layouts.sideBar.settings.laboratories",
        to: "settings/laboratories",
      },
      {
        label: "layouts.sideBar.settings.refrigerators",
        to: "settings/refrigerators",
      },
      {
        label: "layouts.sideBar.settings.freezers",
        to: "settings/freezers",
      },
    ],
  },
];

export default sidebarItems;
