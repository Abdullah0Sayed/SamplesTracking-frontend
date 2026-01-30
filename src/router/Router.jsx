// src/routes/app_router.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyOtp from "../pages/Auth/VerifyOtp";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Home from "../pages/dashboard/Home/Home";
import ForgetPassword from "../pages/Auth/ForgetPassword";
import ChangePassword from "../pages/Auth/ChangePassword";
import VerifiedPage from "../pages/Auth/VerifiedPage";

import Admins from "../pages/dashboard/Accounts/Admins/Admins";
import AddAdmin from "../pages/dashboard/Accounts/Admins/AddAdmin";
import EditAdmin from "../pages/dashboard/Accounts/Admins/EditAdmin";

import Blocked from "../pages/dashboard/Accounts/Blocked/Blocked";

import SampleCodes from "../pages/dashboard/Settings/SampleCodes/SampleCodes";
import TestCodes from "../pages/dashboard/Settings/TestCodes/TestCodes";
import Workflows from "../pages/dashboard/Settings/Workflows/Workflows";
import AddSampleCode from "../pages/dashboard/Settings/SampleCodes/AddSampleCode";
import AddTestCode from "../pages/dashboard/Settings/TestCodes/AddTestCode";
import EditSampleCode from "../pages/dashboard/Settings/SampleCodes/EditSampleCode";
import EditTestCode from "../pages/dashboard/Settings/TestCodes/EditTestCode";
import AddWorkflow from "../pages/dashboard/Settings/Workflows/AddWorkflow";
import EditWorkflow from "../pages/dashboard/Settings/Workflows/EditWorkflow";
import Samples from "../pages/dashboard/Samples/Samples";
import AddSample from "../pages/dashboard/Samples/AddSample";
import EditSample from "../pages/dashboard/Samples/EditSample";
import BioBanking from "../pages/dashboard/BioBanking/BioBanking";
import AddBioBanking from "../pages/dashboard/BioBanking/AddBioBanking";
import SampleProfile from "../pages/dashboard/Samples/SampleProfile";
import EditBioBanking from "../pages/dashboard/BioBanking/EditBioBanking";
import Refrigerators from "../pages/dashboard/Settings/Refrigerators/Refrigerators";
import AddRefrigerator from "../pages/dashboard/Settings/Refrigerators/AddRefrigerator";
import EditRefrigerator from "../pages/dashboard/Settings/Refrigerators/EditRefrigerator";
import Freezers from "../pages/dashboard/Settings/Freezers/Freezers";
import AddFreezer from "../pages/dashboard/Settings/Freezers/AddFreezer";
import EditFreezer from "../pages/dashboard/Settings/Freezers/EditFreezer";
import Roles from "../pages/dashboard/Roles/Roles";
import AddRole from "../pages/dashboard/Roles/AddRole";
import ProtectedRoute from "../middlewares/ProtectedRoute";
import AuthedProfile from "../pages/dashboard/Settings/AuthedProfile";
import Laboratories from "../pages/dashboard/Settings/Laboratories/Laboratories";
import AddLaboratory from "../pages/dashboard/Settings/Laboratories/AddLaboratory";
import EditLaboratory from "../pages/dashboard/Settings/Laboratories/EditLaboratory";
import Departments from "../pages/dashboard/Settings/Departments/Departments";
import AddDepartment from "../pages/dashboard/Settings/Departments/AddDepartment";
import EditDepartment from "../pages/dashboard/Settings/Departments/EditDepartment";
import MasterSteps from "../pages/dashboard/Settings/MasterSteps/MasterSteps";
import AddMasterStep from "../pages/dashboard/Settings/MasterSteps/AddMasterStep";
import EditMasterStep from "../pages/dashboard/Settings/MasterSteps/EditMasterStep";
import StorageLocations from "../pages/dashboard/Settings/StorageLocations/StorageLocations";
import AddStorageLocation from "../pages/dashboard/Settings/StorageLocations/AddStorageLocation";
import EditStorageLocation from "../pages/dashboard/Settings/StorageLocations/EditStorageLocation";
import WorkflowSteps from "../pages/dashboard/Settings/WorkflowSteps/WorkflowSteps";
import AddWorkflowStep from "../pages/dashboard/Settings/WorkflowSteps/AddWorkflowStep";
import EditWorkflowStep from "../pages/dashboard/Settings/WorkflowSteps/EditWorkflowStep";
import Queues from "../pages/dashboard/Queues/Queues";
import QueuesOverView from "../pages/dashboard/Queues/QueuesOverView";
import BioBankingProfile from "../pages/dashboard/BioBanking/BioBankingProfile";
import StepSlasRules from "../pages/dashboard/Settings/StepSlasRules/StepSlasRules";
import AddStepSlasRule from "../pages/dashboard/Settings/StepSlasRules/AddStepSlasRule";
import EditStepSlasRule from "../pages/dashboard/Settings/StepSlasRules/EditStepSlasRule";

export const app_router = createBrowserRouter([
  // Redirect from root
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },

  // Auth routes
  {
    path: "/auth/login",
    element: (
      <Suspense fallback={`loading ...`}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <Suspense fallback={`loading ...`}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: "/auth/forget-password",
    element: (
      <Suspense fallback={`loading ...`}>
        <ForgetPassword />
      </Suspense>
    ),
  },
  {
    path: "/auth/forget-password/change",
    element: (
      <Suspense fallback={`loading ...`}>
        <ChangePassword />
      </Suspense>
    ),
  },
  {
    path: "/auth/verify-otp",
    element: (
      <Suspense fallback={`loading ...`}>
        <VerifyOtp />
      </Suspense>
    ),
  },
  {
    path: "/auth/verification",
    element: (
      <Suspense fallback={`loading ...`}>
        <VerifiedPage type={`phone`} />
      </Suspense>
    ),
  },

  // Dashboard routes
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />,
          </ProtectedRoute>
        ),
      },
      {
        path: "me",
        element: <AuthedProfile />,
      },
      {
        path: "samples",
        element: (
          <ProtectedRoute
            requiredPermissions={[
              "samples.create",
              "samples.edit",
              "samples.delete",
              "samples.show",
            ]}
          >
            <Samples />
          </ProtectedRoute>
        ),
      },
      {
        path: "samples/add",
        element: (
          <ProtectedRoute requiredPermissions={["samples.create"]}>
            <AddSample />
          </ProtectedRoute>
        ),
      },
      {
        path: "samples/:id/edit",
        element: (
          <ProtectedRoute
            requiredPermissions={["samples.edit", "samples.show"]}
          >
            <EditSample />
          </ProtectedRoute>
        ),
      },
      {
        path: "samples/:id/show",
        element: (
          <ProtectedRoute requiredPermissions={["samples.show"]}>
            <SampleProfile />
          </ProtectedRoute>
        ),
      },

      {
        path: "bio-banking",
        element: (
          <ProtectedRoute
            requiredPermissions={[
              "bioBanking.create",
              "bioBanking.show",
              "bioBanking.edit",
              "bioBanking.delete",
            ]}
          >
            <BioBanking />
          </ProtectedRoute>
        ),
      },
      {
        path: "bio-banking/add",
        element: (
          <ProtectedRoute requiredPermissions={["bioBanking.create"]}>
            <AddBioBanking />
          </ProtectedRoute>
        ),
      },
      {
        path: "bio-banking/:id/edit",
        element: (
          <ProtectedRoute requiredPermissions={["bioBanking.edit"]}>
            <EditBioBanking />
          </ProtectedRoute>
        ),
      },
      {
        path: "bio-banking/:id/profile",
        element: (
          <ProtectedRoute requiredPermissions={["bioBanking.show"]}>
            <BioBankingProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "accounts",
        children: [
          // {
          //     path: "blocked",
          //     element: <ProtectedRoute>
          //         <Blocked />
          //     </ProtectedRoute>
          //     ,
          // },
          {
            path: "admins",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "users.create",
                  "users.show",
                  "users.edit",
                  "users.delete",
                ]}
              >
                <Admins />
              </ProtectedRoute>
            ),
          },
          {
            path: "admins/add",
            element: (
              <ProtectedRoute requiredPermissions={["users.create"]}>
                <AddAdmin />
              </ProtectedRoute>
            ),
          },
          {
            path: "admins/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["users.edit"]}>
                <EditAdmin />
              </ProtectedRoute>
            ),
          },
          {
            path: "roles",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "roles.create",
                  "roles.show",
                  "roles.edit",
                  "roles.delete",
                ]}
              >
                <Roles />
              </ProtectedRoute>
            ),
          },
          {
            path: "roles/add",
            element: (
              <ProtectedRoute requiredPermissions={["roles.create"]}>
                <AddRole />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "queues",
        children: [
          {
            path: "all",
            element: (
              <ProtectedRoute requiredPermissions={["queues.all"]}>
                <Queues />
              </ProtectedRoute>
            ),
          },
          {
            path: "overview",
            element: (
              <ProtectedRoute requiredPermissions={["queues.overview"]}>
                <QueuesOverView />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "settings",
        children: [
          {
            path: "sample-codes",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "sample_codes.create",
                  "sample_codes.show",
                  "sample_codes.edit",
                  "sample_codes.delete",
                ]}
              >
                <SampleCodes />
              </ProtectedRoute>
            ),
          },
          {
            path: "sample-codes/add",
            element: (
              <ProtectedRoute requiredPermissions={["sample_codes.create"]}>
                <AddSampleCode />
              </ProtectedRoute>
            ),
          },
          {
            path: "sample-codes/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["sample_codes.edit"]}>
                <EditSampleCode />
              </ProtectedRoute>
            ),
          },
          {
            path: "step-slas-rules",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "step_slas_rules.create",
                  "step_slas_rules.show",
                  "step_slas_rules.edit",
                  "step_slas_rules.delete",
                ]}
              >
                <StepSlasRules />
              </ProtectedRoute>
            ),
          },
          {
            path: "step-slas-rules/add",
            element: (
              <ProtectedRoute requiredPermissions={["step_slas_rules.create"]}>
                <AddStepSlasRule />
              </ProtectedRoute>
            ),
          },
          {
            path: "step-slas-rules/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["step_slas_rules.edit"]}>
                <EditStepSlasRule />
              </ProtectedRoute>
            ),
          },
          {
            path: "test-codes",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "test_codes.create",
                  "test_codes.show",
                  "test_codes.edit",
                  "test_codes.delete",
                ]}
              >
                <TestCodes />
              </ProtectedRoute>
            ),
          },
          {
            path: "test-codes/add",
            element: (
              <ProtectedRoute requiredPermissions={["test_codes.create"]}>
                <AddTestCode />
              </ProtectedRoute>
            ),
          },
          {
            path: "test-codes/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["test_codes.edit"]}>
                <EditTestCode />
              </ProtectedRoute>
            ),
          },
          {
            path: "departments",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "departments.create",
                  "departments.show",
                  "departments.edit",
                  "departments.delete",
                ]}
              >
                <Departments />
              </ProtectedRoute>
            ),
          },
          {
            path: "departments/add",
            element: (
              <ProtectedRoute requiredPermissions={["departments.create"]}>
                <AddDepartment />
              </ProtectedRoute>
            ),
          },
          {
            path: "departments/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["departments.edit"]}>
                <EditDepartment />
              </ProtectedRoute>
            ),
          },
          {
            path: "master-steps",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "master_steps.create",
                  "master_steps.show",
                  "master_steps.edit",
                  "master_steps.delete",
                ]}
              >
                <MasterSteps />
              </ProtectedRoute>
            ),
          },
          {
            path: "master-steps/add",
            element: (
              <ProtectedRoute requiredPermissions={["master_steps.create"]}>
                <AddMasterStep />
              </ProtectedRoute>
            ),
          },
          {
            path: "master-steps/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["master_steps.edit"]}>
                <EditMasterStep />
              </ProtectedRoute>
            ),
          },
          {
            path: "storage-locations",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "storage_locations.create",
                  "storage_locations.show",
                  "storage_locations.edit",
                  "storage_locations.delete",
                ]}
              >
                <StorageLocations />
              </ProtectedRoute>
            ),
          },
          {
            path: "storage-locations/add",
            element: (
              <ProtectedRoute
                requiredPermissions={["storage_locations.create"]}
              >
                <AddStorageLocation />
              </ProtectedRoute>
            ),
          },
          {
            path: "storage-locations/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["storage_locations.edit"]}>
                <EditStorageLocation />
              </ProtectedRoute>
            ),
          },
          {
            path: "workflow-steps",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "workflow_steps.create",
                  "workflow_steps.show",
                  "workflow_steps.edit",
                  "workflow_steps.delete",
                ]}
              >
                <WorkflowSteps />
              </ProtectedRoute>
            ),
          },
          {
            path: "workflow-steps/add",
            element: (
              <ProtectedRoute requiredPermissions={["workflow_steps.create"]}>
                <AddWorkflowStep />
              </ProtectedRoute>
            ),
          },
          {
            path: "workflow-steps/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["workflow_steps.edit"]}>
                <EditWorkflowStep />
              </ProtectedRoute>
            ),
          },
          {
            path: "workflows",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "workflows.create",
                  "workflows.show",
                  "workflows.edit",
                  "workflows.delete",
                ]}
              >
                <Workflows />
              </ProtectedRoute>
            ),
          },
          {
            path: "workflows/add",
            element: (
              <ProtectedRoute requiredPermissions={["workflows.create"]}>
                <AddWorkflow />
              </ProtectedRoute>
            ),
          },
          {
            path: "workflows/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["workflows.edit"]}>
                <EditWorkflow />
              </ProtectedRoute>
            ),
          },
          {
            path: "refrigerators",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "refrigerators.create",
                  "refrigerators.show",
                  "refrigerators.edit",
                  "refrigerators.delete",
                ]}
              >
                <Refrigerators />
              </ProtectedRoute>
            ),
          },
          {
            path: "refrigerators/add",
            element: (
              <ProtectedRoute requiredPermissions={["refrigerators.create"]}>
                <AddRefrigerator />
              </ProtectedRoute>
            ),
          },
          {
            path: "refrigerators/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["refrigerators.edit"]}>
                <EditRefrigerator />
              </ProtectedRoute>
            ),
          },
          {
            path: "freezers",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "freezers.create",
                  "freezers.show",
                  "freezers.edit",
                  "freezers.delete",
                ]}
              >
                <Freezers />
              </ProtectedRoute>
            ),
          },
          {
            path: "freezers/add",
            element: (
              <ProtectedRoute requiredPermissions={["freezers.create"]}>
                <AddFreezer />
              </ProtectedRoute>
            ),
          },
          {
            path: "freezers/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["freezers.edit"]}>
                <EditFreezer />
              </ProtectedRoute>
            ),
          },

          {
            path: "laboratories",
            element: (
              <ProtectedRoute
                requiredPermissions={[
                  "laboratories.create",
                  "laboratories.show",
                  "laboratories.edit",
                  "laboratories.delete",
                ]}
              >
                <Laboratories />
              </ProtectedRoute>
            ),
          },
          {
            path: "laboratories/add",
            element: (
              <ProtectedRoute requiredPermissions={["laboratories.create"]}>
                <AddLaboratory />
              </ProtectedRoute>
            ),
          },
          {
            path: "laboratories/:id/edit",
            element: (
              <ProtectedRoute requiredPermissions={["laboratories.edit"]}>
                <EditLaboratory />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);
