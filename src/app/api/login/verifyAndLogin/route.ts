import { connect } from "@/helpers/dbConfig";
import Official from "@/models/officials.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

connect()
console.log('code entered herererererer')

export async function POST(request:NextRequest) {
    try {
        console.log("Login request received")
        const {email, govId, password} = await request.json()
        console.log(email, govId, password)
        const official = await Official.findOne({email, gov_id: govId})
        console.log(official)

        const isPasswordValid = await bcrypt.compare(password, official.password_hash)
        if(!isPasswordValid) {
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        console.log(isPasswordValid)

        const tokenData = {
            id: official._id,
            email: official.email,
            gov_id: official.gov_id,
        }
        //create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"})
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        })
        console.log(token)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // required in prod
            sameSite: "lax",
            path: "/"
        })

        return NextResponse.json({message: "successfull login", data: {official, token}}, {status: 200})

    } catch (error:any) {
        return NextResponse.json({error:error.message}, {status:500})
    }
}