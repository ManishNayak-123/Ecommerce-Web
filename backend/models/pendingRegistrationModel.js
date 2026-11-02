import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    profilePicture: {
       type: String,
       default: ""
     }
    ,
    passwordHash: {
        type: String,
        required: true
    },
    otpHash: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    },
    attempts: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PendingRegistration = mongoose.model(
    "PendingRegistration",
    pendingRegistrationSchema
);

export default PendingRegistration;