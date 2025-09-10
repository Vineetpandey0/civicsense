import mongoose, { Schema } from "mongoose";

const slaLogSchema = new Schema({
    complaint_id: { 
        type: Schema.Types.ObjectId, 
        ref: "complaints", 
        required: true 
    },
    official_id: { 
        type: Schema.Types.ObjectId, 
        ref: "officials" 
    },
    due_date: { 
        type: Date, 
        required: true 
    },
    escalated_to: { 
        type: Schema.Types.ObjectId, 
        ref: "officials" 
    },
    status: { 
        type: String, 
        enum: ["met", "missed", "escalated"], 
        default: "met" 
    }
}, { timestamps: true });

const SLALog = mongoose.models.sla_logs || mongoose.model("sla_logs", slaLogSchema);
export default SLALog;
