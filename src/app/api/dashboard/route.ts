import { connect } from "@/helpers/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import Complaint from '@/models/complaints.model'

connect()

export async function GET(request:NextRequest){
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')
        const govId = searchParams.get('govId')
        const token = searchParams.get('token')

        const complaintList = await Complaint.
    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status: 501})
    }
}