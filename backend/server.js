
import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectedDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import foodRouter from "./routes/foodRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import analyticsRouter from "./routes/googleAnalyticsRoutes.js";
import driverRouter from "./routes/driverRoutes.js";
import path from "path";
dotenv.config();

const app = express();

const _dirname = path.resolve();
const server = http.createServer(app); // Wrap Express app in Node's HTTP server for Socket.io

// Initialize Socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded profile pictures and files
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/v1/user", authRoutes);
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/info", contactRouter);
app.use("/api/v1/admin", analyticsRouter);
app.use("/api/v1/driver", driverRouter);

app.use(express.static(path.join(_dirname,"/my-project/dist")));
app.get(/.*/,(_,res)=>{
    res.sendFile(path.resolve(_dirname,"my-project","dist","index.html"));
});
// Socket.io Real-Time Tracking Events
io.on("connection", (socket) => {
  console.log("A client connected via WebSocket:", socket.id);

  // Driver or Customer joins a specific order room
  socket.on("join-order", (orderId) => {
    socket.join(orderId);
    console.log(`Client joined order room: ${orderId}`);
  });

  // 1. Receive GPS coordinates from driver app and broadcast to customer view
  socket.on("update-location", ({ orderId, lat, lng }) => {
    // Emitting both names to maintain compatibility with whatever your frontend listens for
    io.to(orderId).emit("receive-location", { orderId, lat, lng });
    io.to(orderId).emit("live-location-update", { lat, lng });
  });

  // 2. ⚡ NEW: Receive order status change from driver and broadcast instantly to TrackOrder
  socket.on("update-order-status", ({ orderId, orderStatus }) => {
    console.log(`Order status updated for [${orderId}]: ${orderStatus}`);
    io.to(orderId).emit("order-status-updated", { orderId, orderStatus });
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected from WebSocket");
  });
});

const PORT = process.env.PORT || 8000;


// Connect to Database and start the HTTP server
connectedDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });