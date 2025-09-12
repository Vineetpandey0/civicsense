import mongoose, { Schema } from "mongoose";

const officialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    gov_id: {
      type: String,
      required: true,
      index: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["inspector", "department_head", "admin"],
      default: "inspector",
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    last_login: {
      type: Date,
      default: null,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
      geohash: {
        type: String,
        trim: true,
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
    service_radius_km: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

// Create 2dsphere index for location
officialSchema.index({ location: "2dsphere" });

const Official = mongoose.models.officials || mongoose.model("officials", officialSchema);

export default Official;