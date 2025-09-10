import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
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
    phone: { 
        type: String, 
        trim: true 
    },
    password_hash: { 
        type: String, 
        required: true 
    },
    profile_photo_url: { 
        type: String, 
        default: "/images/profile_logo.png" 
    },
    points: { 
        type: Number, 
        default: 0 
    },
    badges: [{ 
        type: String, 
        trim: true 
    }],
    complaints: [{ 
        type: Schema.Types.ObjectId, 
        ref: "complaints" 
    }]
}, { timestamps: true });

const User = mongoose.models.users || mongoose.model("users", userSchema);
export default User;
