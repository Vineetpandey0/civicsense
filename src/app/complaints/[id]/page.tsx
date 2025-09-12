"use client";

import { useParams } from "next/navigation";
import { useComplaintStore } from "@/store/complaintStore";
import { useEffect, useState } from "react";
import {
  Ban,
  Check,
  ChevronRight,
  CircleCheckBig,
  Edit,
  Hourglass,
  MessageSquarePlus,
  StickyNote,
} from "lucide-react";

import Link from "next/link";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/components/LoadingSpinner";
import { useEscalationLogStore } from "@/store/escalationLog";

export default function ComplaintDetails() {
  const { id } = useParams(); // dynamic route param
  const complaints = useComplaintStore((state) => state.complaints);
  const updateComplaintStatus = useComplaintStore(
    (state) => state.updateComplaintStatus
  );
  const escalationLogs = useEscalationLogStore(
    (state) => state.escalationLogs
  );
  const setEscalationLogs = useEscalationLogStore(
    (state) => state.setEscalationLogs
  );
  const clearEscalationLogs = useEscalationLogStore(
    (state) => state.clearEscalationLogs
  );
  const [complaint, setComplaint] = useState<any>(null);
  const [status, setStatus] = useState<string>("Rejected");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const currentLog = escalationLogs?.find((log) => log.complaint_id === id);
  console.log(currentLog);

  useEffect(() => {
    if (!id || !complaints.length) return;
    const found = complaints.find((c) => c._id === id);
    setComplaint(found || null);
    console.log(found);
  }, [id, complaints]);

  if (!complaint) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Complaint not found...</p>
      </div>
    );
  }

  const updateStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `/api/complaints/${complaint._id}/updateStatus`,
        { status, id, note }
      );
      updateComplaintStatus(id, status);
      console.log(response.data);
      clearEscalationLogs();
      setEscalationLogs(response.data.escalationLogs);
      toast.success("Status Updated");
    } catch (error: any) {
      console.error("Error updating status:", error.message);
      toast.error("Error while updating status");
    } finally {
      setLoading(false);
      setNote("");
    }
    setOpen(false);
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white text-gray-900"
      style={{ fontFamily: '"Spline Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Main Content */}
        <main className="flex flex-1 justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="w-full max-w-6xl">
            {/* Breadcrumb */}
            <div className="mb-6 px-4">
              <nav
                aria-label="Breadcrumb"
                className="flex items-center text-sm font-medium"
              >
                <Link
                  href="/complaints"
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Complaints
                </Link>
                <span className="material-symbols-outlined mx-2 text-gray-400">
                  <ChevronRight />
                </span>
                <span className="text-gray-800">
                  Complaint #{complaint.complaintNo}
                </span>
              </nav>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Content */}
              <div className="lg:w-2/3 space-y-8">
                {/* Complaint Details */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <h1 className="text-3xl font-bold leading-tight text-gray-900">
                        {complaint.title}
                      </h1>
                      <p className="text-gray-500 text-sm mt-1">
                        Complaint #{complaint.complaintNo} • Reported on{" "}
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset
                        ${
                          complaint.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800 ring-yellow-200"
                            : complaint.status === "Acknowledged"
                            ? "bg-blue-100 text-blue-800 ring-blue-200"
                            : complaint.status === "In Progress"
                            ? "bg-purple-100 text-purple-800 ring-purple-200"
                            : complaint.status === "Resolved"
                            ? "bg-green-100 text-green-800 ring-green-200"
                            : complaint.status === "Rejected"
                            ? "bg-red-100 text-red-800 ring-red-200"
                            : "bg-gray-100 text-gray-800 ring-gray-200"
                        }`}
                    >
                      {/* Status icon with color */}
                      {complaint.status === "Pending" && (
                        <Hourglass className="mr-1.5 text-yellow-600" size={16} />
                      )}
                      {complaint.status === "Acknowledged" && (
                        <MessageSquarePlus className="mr-1.5 text-blue-600" size={16} />
                      )}
                      {complaint.status === "In Progress" && (
                        <Edit className="mr-1.5 text-purple-600" size={16} />
                      )}
                      {complaint.status === "Resolved" && (
                        <Check className="mr-1.5 text-green-600" size={16} />
                      )}
                      {complaint.status === "Rejected" && (
                        <Ban className="mr-1.5 text-red-600" size={16} />
                      )}
                      {complaint.status}
                    </span>

                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <p className="text-gray-500 font-medium">Category</p>
                        <p className="text-gray-800 mt-1">
                          {complaint.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium">Location</p>
                        <p className="text-gray-800 mt-1">
                          {complaint.location?.address?.suburb ||
                            "No address available"}{" "}
                          {complaint.location?.address?.road}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-500 font-medium">Description</p>
                        <p className="text-gray-800 mt-1 max-w-prose">
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images (optional, skip if none) */}
                {complaint.images?.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h3 className="text-xl font-bold mb-4 text-gray-900">
                      Images
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {complaint.images[0].map((img: string, i: number) => (
                        <img
                          key={i}
                          alt={`Complaint image ${i + 1}`}
                          className="rounded-lg object-cover w-full h-40 cursor-pointer hover:opacity-80 transition-opacity"
                          src={img}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="lg:w-1/3 space-y-8">
                {/* Timeline */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    Timeline
                  </h3>
                  <div className="flow-root">
                    <ul className="-mb-8" role="list">
                      {currentLog?.note?.length > 0 ? (
                        currentLog.note.map((log: any, idx: number) => {
                          // Choose icon + color based on status
                          let icon, bgColor;
                          switch (log.status) {
                            case "Pending":
                              icon = (
                                <Hourglass className="text-yellow-600" size={16} />
                              );
                              bgColor = "bg-yellow-100";
                              break;
                            case "Acknowledged":
                              icon = (
                                <MessageSquarePlus
                                  className="text-blue-600"
                                  size={16}
                                />
                              );
                              bgColor = "bg-blue-100";
                              break;
                            case "In Progress":
                              icon = (
                                <Edit className="text-purple-600" size={16} />
                              );
                              bgColor = "bg-purple-100";
                              break;
                            case "Resolved":
                              icon = (
                                <Check className="text-green-600" size={16} />
                              );
                              bgColor = "bg-green-100";
                              break;
                            case "Rejected":
                              icon = <Ban className="text-red-600" size={16} />;
                              bgColor = "bg-red-100";
                              break;
                            default:
                              icon = (
                                <CircleCheckBig
                                  className="text-gray-600"
                                  size={16}
                                />
                              );
                              bgColor = "bg-gray-100";
                          }

                          return (
                            <li key={log._id || idx}>
                              <div className="relative pb-8">
                                {idx !== currentLog.note.length - 1 && (
                                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                                )}
                                <div className="relative flex space-x-3 items-start">
                                  {/* Icon */}
                                  <div>
                                    <span
                                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${bgColor}`}
                                    >
                                      {icon}
                                    </span>
                                  </div>

                                  {/* Content */}
                                  <div className="min-w-0 flex-1 pt-1.5">
                                    <p className="text-sm font-medium text-gray-800">
                                      {log.status}
                                    </p>

                                    {log.note && (
                                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                                        <StickyNote
                                          size={12}
                                          className="text-gray-500"
                                        />
                                        {log.note}
                                      </p>
                                    )}

                                    <p className="text-xs text-gray-400 mt-0.5">
                                      {new Date(
                                        log.timestamp
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No timeline data available.
                        </p>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    Actions
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* Update status dialog */}
                      <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full h-11 px-4 bg-gray-100 text-gray-800 text-sm font-bold tracking-wide cursor-pointer hover:bg-gray-200 transition-colors">
                            <span className="material-symbols-outlined">
                              <Edit />
                            </span>
                            <span className="truncate">Update Status</span>
                          </button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Update Complaint Status</DialogTitle>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Status Select */}
                            <div className="grid gap-2">
                              <Label htmlFor="status">Select Status</Label>
                              <Select
                                value={status || complaint.status} // Pre-fill with current complaint status
                                onValueChange={(val) => setStatus(val)}
                              >
                                <SelectTrigger
                                  id="status"
                                  className="cursor-pointer"
                                >
                                  <SelectValue placeholder="Choose status" />
                                </SelectTrigger>
                                <SelectContent className="cursor-pointer">
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Acknowledged">
                                    Acknowledged
                                  </SelectItem>
                                  <SelectItem value="In Progress">
                                    In Progress
                                  </SelectItem>
                                  <SelectItem value="Resolved">
                                    Resolved
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Note Field */}
                            <div className="grid gap-2">
                              <Label htmlFor="note">Add Note</Label>
                              <textarea
                                id="note"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Write a brief note about this update..."
                                className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                required
                              />
                              <p className="text-xs text-gray-500">
                                Please provide a short note explaining the
                                reason or context for this status update.
                              </p>
                            </div>
                          </div>

                          <DialogFooter>
                            <Button
                              onClick={updateStatus}
                              disabled={!status || !note.trim() || loading}
                              className="cursor-pointer"
                            >
                              {loading ? <LoadingSpinner /> : "Save"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="flex w-full items-center justify-center gap-2 rounded-full h-11 px-4 bg-red-100 text-red-800 text-sm font-bold tracking-wide cursor-pointer hover:bg-red-200 transition-colors">
                            <span className="material-symbols-outlined">
                              <Ban />
                            </span>
                            <span className="truncate">Reject</span>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reject Complaint</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please provide a reason for rejecting this
                              complaint. This reason will be recorded in the
                              complaint log.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          {/* Textarea for reason */}
                          <div className="grid gap-2 py-4">
                            <Label htmlFor="reason">Rejection Reason</Label>
                            <Textarea
                              id="reason"
                              value={rejectNote}
                              onChange={(e) => setRejectNote(e.target.value)}
                              placeholder="Write your reason for rejection..."
                              required
                            />
                          </div>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                setStatus("Rejected");
                                setNote(rejectNote || "Complaint Rejected");
                                updateStatus();
                              }}
                              className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reject
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
