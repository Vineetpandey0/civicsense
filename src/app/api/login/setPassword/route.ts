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

        // Verify GovData exists
        const user = await GovData.findOne({ email, gov_id: govId });
        if (!user) {
            return NextResponse.json({ error: "GovData not found" }, { status: 404 });
        }

        // Extract lat/lng
        const [lng, lat] = location.coordinates;
        let address = {};

        // ✅ Use Google Geocoding API instead of Nominatim
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
            );
            const data = await res.json();
            console.log(data)

            if (data.status === "OK" && data.results.length > 0) {
                const result = data.results[0]; // most relevant address

                address = {
                    display_name: result.formatted_address,
                    road: result.address_components.find((c: any) =>
                        c.types.includes("route")
                    )?.long_name || "",
                    neighbourhood: result.address_components.find((c: any) =>
                        c.types.includes("neighborhood")
                    )?.long_name || "",
                    suburb: result.address_components.find((c: any) =>
                        c.types.includes("sublocality")
                    )?.long_name || "",
                    city_district: result.address_components.find((c: any) =>
                        c.types.includes("administrative_area_level_2")
                    )?.long_name || "",
                    city: result.address_components.find((c: any) =>
                        c.types.includes("locality")
                    )?.long_name || "",
                    postcode: result.address_components.find((c: any) =>
                        c.types.includes("postal_code")
                    )?.long_name || "",
                    country: result.address_components.find((c: any) =>
                        c.types.includes("country")
                    )?.long_name || "",
                    country_code:
                        result.address_components.find((c: any) =>
                            c.types.includes("country")
                        )?.short_name || "",
                };
            } else {
                console.warn("Google Geocoding API returned no results:", data.status);
            }
        } catch (err: any) {
            console.error("Error fetching address from Google Geocoding:", err.message);
        }

        // Attach enriched address
        location.address = address;

        // Save new official
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
