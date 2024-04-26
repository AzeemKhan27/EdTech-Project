const Section = require("../models/Section");
const Cource = require("../models/Course.js");

exports.createSection = async (req, res) => {
   try {
      //data fetch
      const {courseId, sectionName} = req.body;

      //data validation
      if(!courseId || !sectionName) {
        return res.json({
            success:false,
            message:'All fields are required'
        })
      }
      //create a new section
      const sectionDetails = await Section.create({
         courseId,
         sectionName
      })
      //update cource with section ObjectID
      const updatedCourseDetails = await Cource.findByIdAndUpdate(
                                        courseId, 
                                        {
                                            $push: {
                                                   courseContent: sectionDetails._id
                                                }
                                        },
                                        {new : true},
                                     ).populate({
                                        path: "courseContent",
                                        populate:{
                                            path:"subSection"
                                        }
                                     }).exec();
      //return response
      return res.json({
         success:true,
         message:'Section created/updated successfully',
         updatedCourseDetails
      })
      //return response
   } catch (error) {
      console.log(error.message);
      return res.status(500).json({
         success:false,
         message:error.message,
      })
   }
};

exports.updateSection = async (req,res) => {
    try {
        //data input
        const {sectionName, sectionId} = req.body;
        //data validation
        if(!sectionId || sectionName) {
            return res.json({
                success:false,
                message:'All fields are required'
            })
          }
        //update data
        const updatedSectionDetails = await Section.findByIdAndUpdate(
                                            sectionId, 
                                            {
                                                sectionName
                                            },
                                            {new : true},
                                         );
        //return response
        return res.status(200).json({
            success:true,
            message:'Section updated successfully',
            updatedSectionDetails
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        })
    }
}

exports.deleteSection = async (req,res) => {
    try {
        //get id
        const {sectionId} = req.body;
        //delete section
        await Section.findByIdAndDelete(sectionId);
        //return response
        console.log(`Section deleted successfully`)
        return res.status(200).json({
            success:true,
            message:'Section deleted successfully',
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        })
    }
}