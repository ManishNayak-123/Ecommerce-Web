
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    profilePicture: { 
        type: String,
        default: ""
    },
    // Fields required for the Forgot & Reset Password feature
    resetPasswordOtpHash: {
        type: String,
        select: false
    },
    resetPasswordExpiresAt: {
        type: Date
    },
    resetPasswordAttempts: {
        type: Number,
        default: 0
    }
},
    {timestamps:true}
);

const User = mongoose.model("User", userSchema);
export default User;