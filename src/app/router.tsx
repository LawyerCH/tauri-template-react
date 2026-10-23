import { createHashRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { HomePage } from "@/features/home/HomePage";
import { TasksPage } from "@/features/tasks/TasksPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

export const router = createHashRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "tasks", element: <TasksPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);
