import crypto from "node:crypto";

export const generateOtp = () => {
    return crypto.randomInt(0, 1000000)
        .toString()
        .padStart(6, "0");
};

export const hashOtp = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};