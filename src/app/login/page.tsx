"use client"
import ngeohash from "ngeohash";
import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { IdCard, Lock, Mail } from "lucide-react"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";


function LoginPage() {

    const [email, setEmail] = useState("")
    const [govId, setGovId] = useState("")
    const [loading, setLoading] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [password, setPassword] = useState("")
    const [canSetPassword, setCanSetPassword] = useState(false)
    const [canLogin, setCanLogin] = useState(false)
    const router = useRouter()


    useEffect(() => {
        if(email.length > 0 && govId.length > 0) setIsButtonDisabled(false)
    }, [email, govId])


    const login = async () => {
        try {
            setLoading(true)
            setIsButtonDisabled(true)
            console.log(email, govId)
            const response = await axios.get('/api/login', {params: {email, govId}} )
            console.log(response.data)
            if(response.status === 200) {
                toast.success("Check email for verification link", {duration: 3000})
            }
            if(response.data.canSetPassword === true) {
                setCanSetPassword(true)
            }
            if(response.data.canLogin === true) {
                setCanLogin(true)
            }
        } catch (error:any) {
            console.log(error.message)
            toast.error("Credentials were incorrect. Try again!", {duration: 3000})
        } finally {
            setLoading(false)
            setIsButtonDisabled(false)
        }
    }

    const passwordSet = async () => {
  try {
    setLoading(true);

    let lat: number, lng: number, accuracy: number | null = null;

    // Step 1: Try Google Geolocation API first
    try {
      const googleRes = await fetch(
        `https://www.googleapis.com/geolocation/v1/geolocate?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ considerIp: "true" }),
        }
      );

      const googleData = await googleRes.json();
      if (googleData.location) {
        lat = googleData.location.lat;
        lng = googleData.location.lng;
        accuracy = googleData.accuracy;
        console.log(
          `✅ Google API: Lat=${lat}, Lng=${lng}, Accuracy=${accuracy}m`
        );
      } else {
        throw new Error("Google API did not return location");
      }
    } catch (googleError) {
      console.warn("Google API failed, trying GPS:", googleError);

      try {
        // Step 2: Fallback to GPS (watchPosition style, single fix)
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 20000,
              maximumAge: 0,
            })
        );

        lat = position.coords.latitude;
        lng = position.coords.longitude;
        accuracy = position.coords.accuracy;
        console.log(`✅ GPS: Lat=${lat}, Lng=${lng}, Accuracy=${accuracy}m`);
      } catch (gpsError) {
        console.warn("GPS failed, falling back to IP API:", gpsError);

        // Step 3: Final fallback → IP API
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        lat = ipData.latitude;
        lng = ipData.longitude;
        accuracy = null;
        console.log(`🌐 IP-based: Lat=${lat}, Lng=${lng}`);
      }
    }

    // Step 4: Build location object
    const updatedLocation = {
      type: "Point",
      coordinates: [lng, lat], // MongoDB expects [lng, lat]
      geohash: ngeohash.encode(lat, lng),
      accuracy,
      timestamp: new Date().toISOString(),
    };

    // Step 5: Send to backend
    const response = await axios.post("/api/login/setPassword", {
      email,
      govId,
      password,
      location: updatedLocation,
    });

    console.log("Backend Response:", response.data);
    toast.success("Password set successfully! Now Login using credentials", {
      duration: 5000,
    });
    router.push("/login");
  } catch (error: any) {
    console.error("Error in passwordSet:", error.message);
    toast.error("Unable to set password. Please try again.", { duration: 3000 });
  } finally {
    setLoading(false);
    setPassword("");
  }
};




    const verifyAndLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/login/verifyAndLogin", {
            email,
            govId,
            password,
            });

            if (response.status === 200 && response.data?.data) {
            setCanLogin(true)
            const { official, token } = response.data.data;

            // ✅ set login details in Zustand store
            const setLogin = useAuthStore.getState().setLogin;
            setLogin({
                id: official._id.toString(),
                email: official.email,
                govId: official.gov_id,
                token,
                role: official.role,
                department: official.department,
                phone: official.phone,
                last_login: official.last_login,
                location: official.location,
            });

            toast.success("Login successful!", { duration: 3000 });
            router.push('/dashboard')
            } else {
            toast.error("Login failed. Please check your credentials.", {
                duration: 3000,
            });
            }
        } catch (error: any) {
            console.error("Error in verifyAndLogin:", error.message);
            toast.error("Unable to login. Please try again.", { duration: 3000 });
        } finally {
            setLoading(false);
            setPassword("");
            setCanLogin(false)
        }
    };

    return (
        <div className="min-h-screen w-screen flex flex-col  items-center">

            {!canSetPassword && !canLogin && (
                <Card className="sm:w-1/3 w-full mt-20 text-center sm:shadow-xl shadow-none border-none ">
                    <CardHeader>
                        <CardTitle className="text-3xl m-2">Login to your account</CardTitle>
                        <CardDescription>
                            Enter your official email and government id below to login to your account
                        </CardDescription>
                        
                    </CardHeader>
                    <CardContent className="m-2">
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative flex items-center ">
                                        <Mail className="absolute left-2 opacity-60"/>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            className="pl-10 h-10"
                                            onChange={(e) => {setEmail(e.target.value)}}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="govId">Government ID</Label>
                                    </div>
                                    <div className="relative flex items-center ">
                                        <IdCard className="absolute left-2 opacity-60"/>
                                        <Input id="govId" 
                                        type="text" 
                                        placeholder="GOV12345" 
                                        className="pl-10 h-10" 
                                        onChange={(e) => {setGovId(e.target.value)}}
                                        required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button 
                        type="submit" 
                        className="w-full h-10 bg-green-500  hover:bg-green-600 transition:hover duration-400 cursor-pointer rounded-3xl"
                        onClick={login}
                        disabled= {isButtonDisabled}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {canSetPassword && !canLogin && (
                <Card className="sm:w-1/3 w-full mt-20 text-center sm:shadow-xl shadow-none border-none ">
                    <CardHeader>
                        <CardTitle className="text-3xl m-2">Set a password</CardTitle>
                        
                    </CardHeader>
                    <CardContent className="m-2">
                        <form>
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <div className="relative flex items-center ">
                                        <Mail className="absolute left-2 "/>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            className="pl-10 h-10 border-none"
                                            value={email}
                                            disabled
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    
                                    <div className="relative flex items-center ">
                                        <IdCard className="absolute left-2"/>
                                        <Input id="govId" 
                                        type="text" 
                                        placeholder="GOV12345" 
                                        className="pl-10 h-10 border-none" 
                                        value={govId}
                                        disabled
                                        required 
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <div className="relative flex items-center ">
                                        <Lock className="absolute left-2"/>
                                        <Input id="password" 
                                        type="password" 
                                        placeholder="Set a strong password" 
                                        className="pl-10 h-10 " 
                                        onChange={(e) => {setPassword(e.target.value)}}
                                        
                                        required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button 
                        type="submit" 
                        className="w-full h-10 bg-green-500  hover:bg-green-600 transition:hover duration-400 cursor-pointer rounded-3xl"
                        onClick={passwordSet}
                        disabled = {password.length === 0}
                        >
                            {loading ? "Setting Password..." : "Set Password"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {canLogin && !canSetPassword && (
                <Card className="sm:w-1/3 w-full mt-20 text-center sm:shadow-xl shadow-none border-none ">
                    <CardHeader>
                        <CardTitle className="text-3xl m-2">Login to your account</CardTitle>
                        <CardDescription>
                            Enter your official email and government id below to login to your account
                        </CardDescription>
                        
                    </CardHeader>
                    <CardContent className="m-2">
                        <form>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative flex items-center ">
                                        <Mail className="absolute left-2 opacity-60"/>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            className="pl-10 h-10"
                                            disabled
                                            value={email}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="govId">Government ID</Label>
                                    </div>
                                    <div className="relative flex items-center ">
                                        <IdCard className="absolute left-2 opacity-60"/>
                                        <Input id="govId" 
                                        type="text" 
                                        placeholder="GOV12345" 
                                        className="pl-10 h-10" 
                                        value={govId}
                                        disabled
                                        required 
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                    </div>
                                    <div className="relative flex items-center ">
                                        <Lock className="absolute left-2 opacity-60"/>
                                        <Input id="password" 
                                        type="password" 
                                        placeholder="Enter Password" 
                                        className="pl-10 h-10" 
                                        onChange={(e) => {setPassword(e.target.value)}}
                                        required 
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button 
                        type="submit" 
                        className="w-full h-10 bg-green-500  hover:bg-green-600 transition:hover duration-400 cursor-pointer rounded-3xl"
                        onClick={verifyAndLogin}
                        disabled= {isButtonDisabled}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </CardFooter>
                </Card>
            )}

        </div>
    )
}

export default LoginPage
