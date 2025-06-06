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

const n =90;
const app = express();
const PORT = process.env.PORT || 3600;
const __dirname = path.resolve();
app.use(
  cors({
    origin: [
      "https://frontend-five-gamma-26.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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



app.get(
  "/auth/google/callback",
  GoogleAuthPassport.authenticate("google", {
    failureRedirect:
      "https://frontend-five-gamma-26.vercel.app/account-create/sign-in",
    session: false,
  }),
  function (req, res) {
 

    if (!req.user){

    console.log("nahi huya");
    console.log(req.user);
      
      return res.redirect(
        "https://frontend-five-gamma-26.vercel.app/account-create/sign-in"
      );

    }
      

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

    // res.redirect(
    //   `https://frontend-five-gamma-26.vercel.app?token=${encodeURIComponent(
    //     JSON.stringify(token)
    //   )}`
    // );

    res.json(req.user)
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

import InstagramAuthPassport from "./authentication/InstagramAuthPassport.js";

app.use(InstagramAuthPassport.initialize())

app.get("/auth/instagram",  InstagramAuthPassport.authenticate("instagram"));


app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "m12y_veri67fy_token_123"; 

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});



// app.get("/auth/instagram/callback", (req, res, next) => {
//   // Meta verification test
//   if (!req.query.code) {
//     return res.status(200).send("Meta validation OK");
//   }
//   next(); // Continue to Passport middleware if ?code is present
// });


import axios from "axios";

app.get('/auth/instagram/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ success: false, message: "No code provided" });
  }

  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', new URLSearchParams({
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
      code: code,
    }).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = tokenResponse.data.access_token;
    const userId = tokenResponse.data.user_id;

    // Step 2: Use access token to get user info (for example)
    const userResponse = await axios.get(`https://graph.instagram.com/${userId}?fields=id,username,account_type&access_token=${accessToken}`);

    // Step 3: Create or update your user in DB here
    // const user = await User.findOrCreate({ instagramId: userResponse.data.id }, ...);

    // Step 4: Create your own JWT token or session for this user
    const token = jwt.sign({ instagramId: userResponse.data.id, username: userResponse.data.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Step 5: Set cookie or redirect with token
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    res.redirect(`https://frontend-five-gamma-26.vercel.app?token=${token}`);

  } catch (error) {
    console.error("Instagram callback error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user profile", error: error.response?.data || error.message });
  }
});


// app.get(
//   "/auth/instagram/callback",
//        InstagramAuthPassport.authenticate("instagram", {
//     failureRedirect:
//       "https://frontend-five-gamma-26.vercel.app/account-create/sign-in",
//     session: false,
//   }),
//   function (req, res) {
   
 
    
//     console.log("------------------callback--------------------------");
//     res.json(req.user)
//     // const token1 = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
//     //   expiresIn: "1h",
//     // });

//     // res.cookie("access_token", token1, {
//     //   httpOnly: true,
//     //   sameSite: "None",
//     //   path: "/",
//     //   secure: true,
//     // });
   

//     // res.redirect(
//     //   `https://frontend-five-gamma-26.vercel.app?token=${encodeURIComponent(
//     //     JSON.stringify(token)
//     //   )}`
//     // );


//   }
// );

import authRoutes from "./routes/auth.router.js";
import compressedVideoRoutes from "./routes/compressed-video.router.js";
import message from "./routes/message.route.js";


app.use("/api/auth", authRoutes);
app.use("/api/compressed-video", compressedVideoRoutes);
app.use("/api/query", message);
app.get("/", (req, res, next) => {
  res.send("My New Project Video Compress");
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

mongoose
  .connect(process.env.MONGODB_STRING)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB");
    console.log(error);
  });
