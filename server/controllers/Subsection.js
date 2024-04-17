const SubSection = require("../models/SubSection")
const Section = require("../models/SubSection")
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.createSubSection = async (req,res) => {
   try {
      //fecth data from Req body
      const { sectionId, title, timeDuration, description } = req.body;
      //extract file/video
      const video = req.files.videoFile;
      //validation
      if(!sectionId || !title || !timeDuration || !description || !video){
         return res.status(400).json({
            success:false,
            message:'All fields are required',
         })
      }
      //upload video to cloudinary
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      //create a sub section
      const subSectionDetails = await SubSection.create({
         title,
         timeDuration,
         description,
         videoUrl:uploadDetails.secure_url,
      });
     
      //update section with this sub section ObjectId
      const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                         {$push:{
                                                             subSection:subSectionDetails._id,
                                                         }},
                                                        {new:true})
                                             .populate("SubSection")           
      //returrn res
      return res.status(200).json({
        success: true,
        message: "Sub Section Created Successfully",
        data:updatedSection
      })
   } catch (error) {
       return res.status(500).json({
           success:false,
           message:"Internal Server Error.",
       })
   }
};

exports.updateSubSection = async (req, res) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;

        // Validation
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
            });
        }

        // Update sub-section
        const updatedSubSection = await SubSection.findByIdAndUpdate(
            subSectionId,
            {
                title,
                timeDuration,
                description,
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Sub-section updated successfully',
            updatedSubSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId } = req.body;

        // Validation
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: 'Sub-section ID is required',
            });
        }

        // Delete sub-section
        await SubSection.findByIdAndDelete(subSectionId);

        return res.status(200).json({
            success: true,
            message: 'Sub-section deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
