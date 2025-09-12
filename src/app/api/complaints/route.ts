import {connect} from "@/helpers/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Complaint from '@/models/complaints.model'
import EscalationLog from "@/models/escalationLogs.model";

connect()

export async function POST(request:NextRequest){
    try {
        const {assigned_to} = await request.json();
        console.log( "code is here/................" , assigned_to);

        const complaints = await Complaint.find({ assigned_to })
        const escalationLogs = await EscalationLog.find({official_id: assigned_to});
        console.log(complaints);
        return NextResponse.json({complaints, escalationLogs}, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}