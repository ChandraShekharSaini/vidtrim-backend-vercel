import express, { urlencoded } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 3600;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  cors({
    origin: ["https://frontend-five-gamma-26.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100,
// })

// app.use(limiter)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

import CompressedVideo from "./models/compressed-video.model.js";

app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No video file uploaded.");
  }

  try {
    console.log("Uploading and compressing the video...");
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "compressed_videos",
        transformation: [{ fetch_format: "auto", crop: "limit", bitrate: 800 }],
      },
      (error, result) => {
        if (error) {
          console.error("Error during upload:", error);
          res.status(500).send("Error uploading video.");
        } else {
          console.log("Compressed video uploaded:", result.secure_url);

          const token = jwt.sign(
            { Url: result.secure_url },
            process.env.JWT_SECRET
          );

          saveVideo(result.secure_url, req.query.id);

          res.status(200).json({
            message: "Video compressed and uploaded successfully!",
            compressedVideoUrl: token,
          });
        }
      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(result);
  } catch (error) {
    console.error("Error during video processing:", error);
    res.status(500).send("Error processing the video.");
  }
});

const saveVideo = async (videoUrl, id) => {
  console.log(videoUrl, id);
  const compressedVideoData = new CompressedVideo({ id, videoUrl });
  await compressedVideoData.save();
};

import GoogleAuthPassport from "./authentication/GoogleAuthPassport.js";

app.use(GoogleAuthPassport.initialize());

app.get(
  "/auth/google",
  GoogleAuthPassport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  GoogleAuthPassport.authenticate("google", {
    failureRedirect:
      "https://frontend-five-gamma-26.vercel.app/account-create/sign-in",
    session: false,
  }),
  function (req, res) {
    if (!req.user)
      return res.redirect(
        "https://frontend-five-gamma-26.vercel.app/account-create/sign-in"
      );

    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const token1 = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("access_token", token1, {
      httpOnly: true,
      path: "/",
      sameSite: "None",
      secure: true,
    });
    console.log(token1);

    res.redirect(
      `https://frontend-five-gamma-26.vercel.app?token=${encodeURIComponent(
        JSON.stringify(token)
      )}`
    );
  }
);

import GithubAuthPassport from "./authentication/GithubAuthPassport.js";
app.use(GithubAuthPassport.initialize());

app.get(
  "/auth/github",
  GithubAuthPassport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  GithubAuthPassport.authenticate("github", {
    failureRedirect:
      "https://frontend-five-gamma-26.vercel.app/account-create/sign-in",
    session: false,
  }),
  function (req, res) {
    if (!req.user)
      return res.redirect(
        "https://frontend-five-gamma-26.vercel.app/account-create/sign-in"
      );
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const token1 = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("access_token", token1, {
      httpOnly: true,
      sameSite: "None",
      path: "/",
      secure: true,
    });
    console.log("GitHub", token1);

    res.redirect(
      `https://frontend-five-gamma-26.vercel.app?token=${encodeURIComponent(
        JSON.stringify(token)
      )}`
    );
  }
);

import authRoutes from "./routes/auth.router.js";
import compressedVideoRoutes from "./routes/compressed-video.router.js";

app.use("/api/auth", authRoutes);
app.use("/api/compressed-video", compressedVideoRoutes);
app.get("/", (req, res, next) => {
  res.send("Hello Boy!!");
});

app.get("/app", (req, res, next) => {
  res.send("Hello Boy!!");
});


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);

  mongoose
    .connect(process.env.MONGODB_STRING)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB");
      console.log(error);
    });
});
