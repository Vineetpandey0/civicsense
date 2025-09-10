"use client"

import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function VerifyEmailPage() {
    const [token, setToken] = useState("")
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState(false)
    const router = useRouter()

    const verifyUserEmail = async () => {
        try {
            await axios.post('/api/verifyemail', { token })
            setVerified(true)
            router.push('/login')
            console.log("Verification successful")
            toast.success("Verification successfull! Login now", {duration : 4000})
        } catch (error: any) {
            setError(true)
            console.log("Verification failed", error.message)
            console.log(error.response.data)
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1]
        setToken(urlToken || "")
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail()
        }
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Verify Email</h1>
            <h2>{token > "" ? `${token}` : "no token"}</h2>

            {verified && (
                <div>
                    <h2 className="text-green-500">Email verified successfully!</h2>
                    <Link href="/login">Login</Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-green-500">Error!!!</h2>
                </div>
            )}
        </div>
    )
}