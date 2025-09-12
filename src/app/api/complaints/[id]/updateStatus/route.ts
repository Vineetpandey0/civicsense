import { connect } from "@/helpers/dbConfig";
import Complaint from "@/models/complaints.model";
import EscalationLog from "@/models/escalationLogs.model";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function PUT(request: NextRequest) {
  try {
    const { status, id, note } = await request.json();
    console.log("Update request received:", { status, id, note });
    if (!status || !id || !note) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update complaint first
    const savedComplaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!savedComplaint) {
      return NextResponse.json(
        { error: "Complaint not found" },
        { status: 404 }
      );
    }

    // Upsert escalation log and push note
    let savedEscalationLog = null;
    try {
      savedEscalationLog = await EscalationLog.findOneAndUpdate(
        { complaint_id: id },
        {
          $push: {
            note: {
              status: savedComplaint.status,
              note: note || "Complaint status updated",
              timestamp: new Date(),
            },
          },
          $setOnInsert: {
            official_id: savedComplaint.assigned_to,
            due_date: savedComplaint?.due_date,
          },
        },
        { new: true, upsert: true }
      );
    } catch (logError: any) {
      console.error("Escalation log failed:", logError.message);
    }

    const escalationLogs = await EscalationLog.find({ complaint_id: id });

    return NextResponse.json(
      { success: true, savedComplaint, savedEscalationLog, escalationLogs },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
