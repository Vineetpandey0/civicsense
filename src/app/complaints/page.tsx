"use client"
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useComplaintStore } from '@/store/complaintStore';
import Link from 'next/link';
import { formatDistanceToNow } from "date-fns";
import { useEscalationLogStore } from '@/store/escalationLog';

function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const clearComplaints = useComplaintStore((state) => state.clearComplaints);
  const setComplaintsList = useComplaintStore((state) => state.setComplaints);
  const setEscalationLogs = useEscalationLogStore((state) => state.setEscalationLogs);
  const clearEscalationLogs = useEscalationLogStore((state) => state.clearEscalationLogs);

  const assigned_to = useAuthStore((state) => state.id);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!assigned_to) return;

      clearComplaints();
      clearEscalationLogs();

      try {
        const response = await axios.post("/api/complaints", { assigned_to });
        setComplaints(response.data.complaints);
        setComplaintsList(response.data.complaints);
        setEscalationLogs(response.data.escalationLogs);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, [assigned_to]);

  // helper for status styling
  const getStatusClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800";
      case "in progress":
        return "status-in-progress px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800";
      case "resolved":
        return "status-resolved px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800";
      case "acknowledged":
        return "status-acknowledged px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800";
      default:
        return "px-3 py-1 text-xs font-semibold rounded-full bg-purple-200 text-purple-800";
    }
  };

  // group complaints by status
  const groupedComplaints = {
    pending: complaints.filter((c) => c.status?.toLowerCase() === "pending"),
    inProgress: complaints.filter((c) => c.status?.toLowerCase() === "in progress"),
    resolved: complaints.filter((c) => c.status?.toLowerCase() === "resolved"),
    acknowledged: complaints.filter((c) => c.status?.toLowerCase() === "acknowledged"),
  };

  const renderTable = (title: string, data: any[]) => (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">{title}</h2>
      <div className="overflow-x-auto">
        <div className="min-w-full inline-block align-middle">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="min-w-full table-fixed divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 w-[14%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complaint ID
                  </th>
                  <th className="px-6 py-4 w-[14%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 w-[14%] text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 w-[14%] text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 w-[14%] text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 w-[14%] text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Filed
                  </th>
                  <th className="px-6 py-4 w-[16%] text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((complaint) => (
                    <tr key={complaint._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.complaintNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {complaint.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {complaint.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {complaint.priority}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                        <span className={getStatusClass(complaint.status)}>
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDistanceToNow(new Date(complaint.createdAt), {
                          addSuffix: true,
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/complaints/${complaint._id}`}
                          className="text-green-600 hover:text-green-700"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No complaints in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Assigned Complaints</h1>

      {renderTable("Pending Complaints", groupedComplaints.pending)}
      {renderTable("In Progress Complaints", groupedComplaints.inProgress)}
      {renderTable("Acknowledged Complaints", groupedComplaints.acknowledged)}
      {renderTable("Resolved Complaints", groupedComplaints.resolved)}

      <style jsx>{`
        .status-pending {
          color: #f59e0b;
          background-color: rgba(245, 158, 11, 0.1);
        }
        .status-in-progress {
          color: #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
        }
        .status-resolved {
          color: #22c55e;
          background-color: rgba(34, 197, 94, 0.1);
        }
        .status-acknowledged {
          color: #8b5cf6;
          background-color: rgba(139, 92, 246, 0.1);
        }
      `}</style>
    </div>
  );
}

export default Complaints;
