import { create } from "zustand"
import { persist } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

// Define the type of a single note inside escalation log
export interface EscalationNote {
  status: "Pending" | "Acknowledged" | "In Progress" | "Resolved"
  note?: string
  timestamp: string // ISO string from Mongo
}

// Define the type of escalation log
export interface EscalationLog {
  _id: string
  complaint_id: string
  official_id: string
  escalated_to?: string
  note: EscalationNote[]
  createdAt: string
  updatedAt: string
}

// Store shape
interface EscalationLogState {
  escalationLogs: EscalationLog[]
  setEscalationLogs: (logs: EscalationLog[]) => void
  addEscalationLog: (log: EscalationLog) => void
  clearEscalationLogs: () => void
}

export const useEscalationLogStore = create<EscalationLogState>()(
  persist(
    immer((set) => ({
      escalationLogs: [],

      setEscalationLogs: (logs) =>
        set((state) => {
          state.escalationLogs = logs
        }),

      addEscalationLog: (log) =>
        set((state) => {
          state.escalationLogs.push(log)
        }),

      clearEscalationLogs: () =>
        set((state) => {
          state.escalationLogs = []
        }),
    })),
    {
      name: "escalation-log-storage", // localStorage key
    }
  )
)
