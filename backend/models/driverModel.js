
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  vehicleType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Active", "Suspended", "Blocked"], 
    default: "Pending" 
  }
}, { timestamps: true });

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;