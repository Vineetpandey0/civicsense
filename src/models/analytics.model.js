import mongoose, { Schema } from "mongoose";

const analyticsSchema = new Schema({
    department_id: { 
        type: Schema.Types.ObjectId, 
        ref: "departments" 
    },
    complaint_count: { 
        type: Number, 
        default: 0 
    },
    avg_resolution_time: { 
        type: Number, 
        default: 0 // in hours 
    },
    hotspot_areas: [
        {
            location: {
                type: { 
                    type: String, 
                    enum: ["Point"], 
                    default: "Point" 
                },
                coordinates: { 
                    type: [Number], 
                    index: "2dsphere" // [lng, lat] 
                }
            },
            count: Number
        }
    ],
    trends: {
        daily: { 
            type: Number, 
            default: 0 
        },
        weekly: { 
            type: Number, 
            default: 0 
        },
        monthly: { 
            type: Number, 
            default: 0 
        }
    }
}, { timestamps: true });

const Analytics = mongoose.models.analytics || mongoose.model("analytics", analyticsSchema);
export default Analytics;
