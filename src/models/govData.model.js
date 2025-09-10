import mongoose, { Schema } from "mongoose";

const govDataSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    gov_id: { 
        type: String, 
        required: true, 
        index: true 
    },
    role: { 
        type: String, 
        enum: ["inspector", "department_head", "admin"], 
        default: "inspector" 
    },
    department: { 
        type: String, 
        required: true, 
        trim: true 
    },
    phone: { 
        type: String, 
        trim: true 
    },
    isVerified: { 
        type: Boolean, 
        default: undefined,
        index: true
    },
    verifyToken: { 
        type: String, 
        default: null
    },
    verifyTokenExpiry: {
        type: Date,
        default: null
    },
    forgotPasswordToken: {
        type: String,
        default: null
    },
    forgotPasswordTokenExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const GovData = mongoose.models.govdatas || mongoose.model("govdatas", govDataSchema);
export default GovData;
