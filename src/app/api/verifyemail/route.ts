import { connect } from "@/helpers/dbConfig";
import { NextResponse, NextRequest } from "next/server";
import GovData from "@/models/govData.model";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {token, tokenType= 'verifyEmail'} = reqBody

        let user;
        if(tokenType === "verifyEmail") {
            user = await GovData.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}}).select('-createdAt -updatedAt -role -department -phone -forgotPasswordToken -forgotPasswordTokenExpiry')
        } else{
            user = await GovData.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$gt: Date.now()}})
        }

        if(!user) {
            return NextResponse.json({error: "Invalid or expired token"}, {status: 400})
        }
        console.log(user)

        console.log(user.isVerified)
        user.isVerified = true
        if (tokenType === "verifyEmail") {
            user.verifyToken = undefined
            user.verifyTokenExpiry = undefined
        } 
        const savedUser = await user.save()
        console.log(savedUser)

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        })
        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, { status: 500 })
    }
}