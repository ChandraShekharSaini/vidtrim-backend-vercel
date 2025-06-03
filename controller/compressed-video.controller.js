import CompressedVideo from "../models/compressed-video.model.js"

export const getCompressedVideo = async (req, res) => {

    console.log(req.params.id)

    try {
        const { id } = req.params
        const compressedVideo = await CompressedVideo.find({ id })

        res.status(200).json({
            message: "Compressed video fetched successfully",
            data: compressedVideo
        })

    } catch (error) {
        next(error.message)
    }
}



export const deleteVideo = async (req, res) => {
    console.log("deleteVideo")
    console.log(req.params.id)
    try {
        const { id } = req.params
        const deletedVideo = await CompressedVideo.findByIdAndDelete({ _id: id })

        res.status(200).json({
            message: "Video deleted successfully",
            data: deletedVideo
        })
    } catch (error) {
        next(error.message)
    }
}
