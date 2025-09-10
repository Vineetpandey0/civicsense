import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    head_id: { 
        type: Schema.Types.ObjectId, 
        ref: "officials" 
    },
    contact_email: { 
        type: String, 
        lowercase: true, 
        trim: true 
    },
    contact_phone: { 
        type: String, 
        trim: true 
    }
}, { timestamps: true });

const Department = mongoose.models.departments || mongoose.model("departments", departmentSchema);
export default Department;
