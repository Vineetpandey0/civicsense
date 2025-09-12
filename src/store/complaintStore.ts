// complaintStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Complaint {
  _id: string;
  complaintNo?: number;
  user_id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  videos: string[];
  location?: {
    type: string;
    coordinates: number[];
    geohash?: string;
    address?: {
      display_name?: string;
      road?: string;
      neighbourhood?: string;
      suburb?: string;
      city_district?: string;
      city?: string;
      postcode?: string;
      country?: string;
      country_code?: string;
    };
  };
  status: "Pending" | "Acknowledged" | "In Progress" | "Resolved";
  priority: "Normal" | "High" | "Critical";
  upvotes: number;
  assigned_to?: string;
  createdAt: string;
  updatedAt: string;
}

interface ComplaintStore {
  complaints: Complaint[];
  setComplaints: (complaints: Complaint[]) => void;
  clearComplaints: () => void;
  updateComplaintStatus: (id: string, status: Complaint["status"]) => void; 
}

export const useComplaintStore = create<ComplaintStore>()(
  persist(
    immer((set) => ({
      complaints: [],

      setComplaints: (complaints) =>
        set((state) => {
          state.complaints = complaints;
        }),

      clearComplaints: () =>
        set((state) => {
          state.complaints = [];
        }),

      updateComplaintStatus: (id, status) =>
        set((state) => {
          const complaint = state.complaints.find((c) => c._id === id);
          if (complaint) {
            complaint.status = status;
            complaint.updatedAt = new Date().toISOString();
          }
        }),
    })),
    {
      name: "complaints-storage",
    }
  )
);
