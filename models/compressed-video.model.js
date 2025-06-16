import mongoose, { Schema } from "mongoose";

const compressedVideoSchema = new Schema({

    id: { type:Number, required: true },
    videoUrl: { type: String, required: true },

}, { timestamps: true })

export default mongoose.model("CompressedVideo", compressedVideoSchema)
