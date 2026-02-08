import { inngest } from "@/lib/inngest/client";
import { CheckBudgetAlert, generateMonthlyReports, processRecurringTransaction, triggerRecurringTransactions } from "@/lib/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        CheckBudgetAlert,triggerRecurringTransactions,processRecurringTransaction,generateMonthlyReports
    ],
});