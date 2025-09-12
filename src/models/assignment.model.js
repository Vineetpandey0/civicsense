import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema({
    complaint_id: { 
        type: Schema.Types.ObjectId, 
        ref: "complaints", 
        required: true 
    },
    official_id: { 
        type: Schema.Types.ObjectId, 
        ref: "officials" 
    },
    department_id: { 
        type: Schema.Types.ObjectId, 
        ref: "departments" 
    },
    due_date: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Pending", "Acknowledged", "In Progress", "Resolved"], 
        default: "open" 
    }
}, { timestamps: true });

const Assignment = mongoose.models.assignments || mongoose.model("assignments", assignmentSchema);
export default Assignment;
