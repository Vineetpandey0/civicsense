"use client"
import React, { useMemo } from "react"
import Link from "next/link"
import { useEscalationLogStore } from "@/store/escalationLog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye } from "lucide-react"

function Dashboard() {
  const escalationLogs = useEscalationLogStore((state) => state.escalationLogs)

  // Flatten logs into individual activities
  const recentActivities = useMemo(() => {
    if (!escalationLogs || escalationLogs.length === 0) return []

    const activities: any[] = []
    escalationLogs.forEach((log: any) => {
      if (Array.isArray(log.note)) {
        log.note.forEach((n: any) => {
          activities.push({
            complaintId: log.complaint_id,
            officialId: log.official_id,
            status: n.status,
            note: n.note,
            timestamp: n.timestamp,
          })
        })
      }
    })

    // Sort by timestamp (latest first)
    return activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [escalationLogs])

  return (
    <div className="w-full p-14">
      <h1 className="text-4xl mb-6 font-bold">Dashboard</h1>

      {/* Summary cards */}
      <div className="flex w-full h-[100px] gap-4 mb-10">
        <div className="w-1/2 border-2 rounded-2xl p-3 flex items-center justify-between bg-white shadow-sm">
          <span className="text-lg font-semibold">Complaints Pending</span>
          <span className="text-2xl font-bold text-yellow-600">
            {
              recentActivities.filter((a) => a.status === "Pending")
                .length
            }
          </span>
        </div>
        <div className="w-1/2 border-2 rounded-2xl p-3 flex items-center justify-between bg-white shadow-sm">
          <span className="text-lg font-semibold">Complaints Resolved</span>
          <span className="text-2xl font-bold text-green-600">
            {
              recentActivities.filter((a) => a.status === "Resolved")
                .length
            }
          </span>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border rounded-2xl shadow-sm">
        <h2 className="text-2xl font-bold px-6 py-4 border-b">
          Recent Activity
        </h2>
        {recentActivities.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, idx) => (
                <TableRow key={idx}>
                  <TableCell className=" w-[700px] max-w-[120px] truncate overflow-hidden whitespace-nowrap">
                    {activity.complaintId}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : activity.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : activity.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {activity.note}
                  </TableCell>
                  <TableCell>
                    {new Date(activity.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/complaints/${activity.complaintId}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={16} /> View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 text-sm p-6">
            No recent activity found.
          </p>
        )}
      </div>
    </div>
  )
}

export default Dashboard
