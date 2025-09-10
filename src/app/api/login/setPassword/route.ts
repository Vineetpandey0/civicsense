import { connect } from "@/helpers/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import Official from "@/models/officials.model";
import GovData from "@/models/govData.model";

connect();

export async function POST(request: NextRequest) {
    try {
        const { email, govId, password, location } = await request.json();

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await GovData.findOne({ email, gov_id: govId });
        if (!user) {
            return NextResponse.json({ error: "GovData not found" }, { status: 404 });
        }

        // Fetch address from Nominatim (backend, no CORS issue)
        const [lng, lat] = location.coordinates;
        let address = {};
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                {
                    headers: {
                        "User-Agent": "civilsense-app/1.0",// required by Nominatim
                    },
                }
            );
            const data = await res.json();
            address = {
                display_name: data.display_name || "",
                road: data.address?.road || "",
                neighbourhood: data.address?.neighbourhood || "",
                suburb: data.address?.suburb || "",
                city_district: data.address?.city_district || "",
                city: data.address?.city || "",
                postcode: data.address?.postcode || "",
                country: data.address?.country || "",
                country_code: data.address?.country_code || "",
            };
        } catch (err: any) {
            console.error("Error fetching address from Nominatim:", err.message);
        }

        // Attach enriched address
        location.address = address;

        const newOfficial = new Official({
            name: user.name,
            email,
            gov_id: govId,
            password_hash: hashedPassword,
            role: user.role,
            department: user.department,
            phone: user.phone,
            last_login: null,
            location: location,
            service_radius_km: 5,
        });

        const savedOfficial = await newOfficial.save();

        return NextResponse.json(
            { message: "Successfully set the password", official: savedOfficial },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
