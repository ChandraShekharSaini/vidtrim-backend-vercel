import mongoose, { Schema } from "mongoose";

const compressedVideoSchema = new Schema({

    id: { type:String, required: true },
    videoUrl: { type: String, required: true },

}, { timestamps: true })

export default mongoose.model("CompressedVideo", compressedVideoSchema)
