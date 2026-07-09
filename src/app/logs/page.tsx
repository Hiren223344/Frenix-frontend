import type { Metadata } from "next";

import { InteractiveLogsTable } from "@/components/ui/interactive-logs-table-shadcnui";

export const metadata: Metadata = {
  title: "Logs — Frenix",
  description: "View and filter your gateway request logs.",
};

export default function LogsPage() {
  return <InteractiveLogsTable />;
}
