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

exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId,courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

		const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"subSection",
			},
		})
		.exec();

		res.status(200).json({
			success: true,
			message: section,
			data:course,
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};


exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   