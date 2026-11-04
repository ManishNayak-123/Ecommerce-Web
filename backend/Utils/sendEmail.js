// // import nodemailer from "nodemailer";

// // const transporter = nodemailer.createTransport({
// //     service: "gmail",
// //     auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_APP_PASSWORD
// //     }
// // });

// // export const sendOtpEmail = async (email, otp) => {
// //     return transporter.sendMail({
// //         from: `"Your App" <${process.env.EMAIL_USER}>`,
// //         to: email,
// //         subject: "Verify your email address",
// //         text: `Your verification code is ${otp}. It expires in 5 minutes. Do not share this code with anyone.`,
// //         html: `
// //             <h2>Email Verification</h2>
// //             <p>Your verification code is:</p>
// //             <h1 style="letter-spacing: 6px">${otp}</h1>
// //             <p>This code expires in 5 minutes.</p>
// //             <p>Do not share this code with anyone.</p>
// //         `
// //     });
// // };

// // import nodemailer from "nodemailer";

// // const emailUser = process.env.EMAIL_USER;
// // const emailPassword = process.env.EMAIL_APP_PASSWORD;

// // console.log("Email user available:", Boolean(emailUser));
// // console.log("Email password available:", Boolean(emailPassword));

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     user: emailUser,
// //     pass: emailPassword,
// //   },
// // });

// // export default async function sendOtpEmail(email, otp) {
// //   try {
// //     await transporter.sendMail({
// //       from: emailUser,
// //       to: email,
// //       subject: "Your registration OTP",
// //       text: `Your OTP is ${otp}. It expires in 5 minutes.`,
// //     });

// //     console.log("OTP email sent successfully");
// //   } catch (error) {
// //     console.error("Email error:", error.message);
// //     throw error;
// //   }
// // }

// // import nodemailer from "nodemailer";

// // const emailUser = process.env.EMAIL_USER?.trim();
// // const emailPassword = process.env.EMAIL_APP_PASSWORD?.trim();

// // console.log("Email user exists:", Boolean(emailUser));
// // console.log("Email password exists:", Boolean(emailPassword));
// // console.log("Email user length:", emailUser?.length);
// // console.log("Email password length:", emailPassword?.length);

// // const transporter = nodemailer.createTransport({
// //   host: "smtp.gmail.com",
// //   port: 465,
// //   secure: true,
// //   auth: {
// //     type: "LOGIN",
// //     user: emailUser,
// //     pass: emailPassword,
// //   },
// // });

// // export default async function sendOtpEmail(email, otp) {
// //   const result = await transporter.sendMail({
// //     from: emailUser,
// //     to: email,
// //     subject: "Your registration OTP",
// //     text: `Your OTP is ${otp}. It expires in 5 minutes.`,
// //   });

// //   console.log("OTP email sent:", result.messageId);
// //   return result;
// // }

// import "dotenv/config";
// import nodemailer from "nodemailer";

// const emailUser = process.env.EMAIL_USER?.trim();
// const emailPassword = process.env.EMAIL_APP_PASSWORD?.trim();

// console.log("Email user exists:", Boolean(emailUser));
// console.log("Email password exists:", Boolean(emailPassword));

// if (!emailUser || !emailPassword) {
//   throw new Error("Email credentials are missing from the environment");
// }

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: emailUser,
//     pass: emailPassword,
//   },
// });

// export default async function sendOtpEmail(email, otp) {
//   return transporter.sendMail({
//     from: emailUser,
//     to: email,
//     subject: "Your registration OTP",
//     text: `Your OTP is ${otp}. It expires in 5 minutes.`,
//   });
// }

import "dotenv/config";
import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER?.trim();
const emailPassword = process.env.EMAIL_APP_PASSWORD?.trim();

console.log("Email user exists:", Boolean(emailUser));
console.log("Email password exists:", Boolean(emailPassword));

if (!emailUser || !emailPassword) {
  throw new Error("Email credentials are missing from the environment");
}

// Explicitly define host and secure settings with strict connection timeouts
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
  // ⚡ Crucial settings for cloud platforms like Render to handle timeouts cleanly
  family: 4,               // Forces IPv4 (prevents IPv6 hanging issues on Render)
  connectionTimeout: 10000, // 10 seconds connection timeout
  greetingTimeout: 10000,   // 10 seconds greeting timeout
  socketTimeout: 10000,     // 10 seconds socket timeout
});

export default async function sendOtpEmail(email, otp) {
  try {
    const result = await transporter.sendMail({
      from: emailUser,
      to: email,
      subject: "Your registration OTP",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your registration verification code is:</p>
          <h1 style="letter-spacing: 6px; color: #f97316;">${otp}</h1>
          <p>This code expires in 5 minutes.</p>
          <p>Do not share this code with anyone.</p>
        </div>
      `,
    });
    
    console.log("OTP email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Nodemailer dispatch failed:", error.message);
    throw error;
  }
}