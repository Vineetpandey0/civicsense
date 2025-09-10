import mongoose, { Schema } from "mongoose";

const complaintSchema = new Schema({
    user_id: { 
        type: Schema.Types.ObjectId, 
        ref: "users", 
        required: true 
    },
    title: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true, 
        trim: true 
    },
    category: { 
        type: String, 
        enum: ["pothole", "garbage", "streetlight", "water", "roads", "other"], 
        required: true 
    },
    images: [{ 
        type: String, 
        trim: true 
    }],
    videos: [{ 
        type: String, 
        trim: true 
    }],
    location: {
        type: { 
            type: String, 
            enum: ["Point"], 
            default: "Point" 
        },
        coordinates: { 
            type: [Number], 
            required: true, 
            index: "2dsphere" // [lng, lat] 
        },
        geohash: { 
            type: String, 
            trim: true 
        },
        address: {
            display_name: { type: String, trim: true },
            road: { type: String, trim: true },
            neighbourhood: { type: String, trim: true },
            suburb: { type: String, trim: true },
            city_district: { type: String, trim: true },
            city: { type: String, trim: true },
            postcode: { type: String, trim: true },
            country: { type: String, trim: true },
            country_code: { type: String, trim: true },
        },
    },
    status: { 
        type: String, 
        enum: ["Pending", "Acknowledged", "In Progress", "Resolved"], 
        default: "Pending" 
    },
    priority: { 
        type: String, 
        enum: ["Normal", "High", "Critical"], 
        default: "Normal" 
    },
    upvotes: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

const Complaint = mongoose.models.complaints || mongoose.model("complaints", complaintSchema);
export default Complaint;
