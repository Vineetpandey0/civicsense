import { connect } from "@/helpers/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import GovData from "@/models/govData.model.js";
import Official from "@/models/officials.model"
import { NextRequest, NextResponse } from "next/server";

// Establish database connection
connect()

export async function GET(request: NextRequest){
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')
        const govId = searchParams.get('govId')
        console.log(email, govId)

        const user = await GovData.findOne({email: email, gov_id: govId}).select('-createdAt -updatedAt -role -department -phone -verifyToken -verifyTokenExpiry -forgotPasswordToken -forgotPasswordTokenExpiry')
        if(!user) {
            return NextResponse.json({message: 'User not found'}, {status: 404})
        }
        console.log(user)

        const official = await Official.findOne({email, gov_id:govId})

        if(user.isVerified && !official) {
            return NextResponse.json({message: 'User already verified. Please Set Password', canSetPassword: true}, {status: 218})
        }

        if(user.isVerified && official) {
            return NextResponse.json({message: 'User already verified. Login ', canSetPassword: false, canLogin:true}, {status: 201})
        }

        await sendEmail({email: email, emailType: 'VERIFY', userId: user._id})
        return NextResponse.json({message: 'Verification email sent. Please check your email inbox', success: true, canSetPassword: true}, {status: 200})

    } catch (error) {
        return NextResponse.json({message: 'Internal Server Error'}, {status: 500})
    }
}


