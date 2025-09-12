import mongoose, { Schema } from "mongoose";

const escalationLogSchema = new Schema({
    complaint_id: { 
        type: Schema.Types.ObjectId, 
        ref: "complaints", 
        required: true 
    },
    official_id: { 
        type: Schema.Types.ObjectId, 
        ref: "officials",
        required: true
    },
    escalated_to: { 
        type: Schema.Types.ObjectId, 
        ref: "officials" 
    },
    note: [{ 
        status: {
            type: String,
            enum: ["Pending", "Acknowledged", "In Progress", "Resolved"],
            default: "Pending"
        },
        note: { type: String, trim: true },
        timestamp: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

const EscalationLog = mongoose.models.escalation_logs || mongoose.model("escalation_logs", escalationLogSchema);
export default EscalationLog;
