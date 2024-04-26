const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async (req, res) => {
    try {

        //fetch data 
        let {courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions} = req.body;

        //get thumbnail from request files
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }

        if (!status || status === undefined) {
			status = "Draft";
		}

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: " , instructorDetails);
        //TODO: Verify that userId and instructorDetails._id  are same or different ?

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            });
        }

        //check given Category is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails) {
            return res.status(404).json({
                success:false,
                message:'Tag Details not found',
            });
        }

        //Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new Course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status,
            instructions
        });

        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        // Add the new course to the categories:
        await Category.findByIdAndUpdate(
            {_id: category},
            {
                $push:{
                    course: newCourse._id,
                },
            },
            {new : true}
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }

};

exports.getAllCourses = async (req,res) => {
   try {
       const allCources = await Course.find(
             {},
             {
                    courseName:true,
                    instructions:true,
                    price:true,
                    thumbnail:true,
                    ratingAndReviews: true,
                    studentsEnrolled:true
             }
    )
       .populate("instructor")
       .exec();

       return res.status(200).json({
           success:true,
           message:"All courses fetched successfully",
           data:allCources,
       })
       
   } catch (error) {
       console.error(error);
       return res.status(500).json({
           success:false,
           message:"Can not fetch cource data",
           message:error.message,
       })
   }
};

//getCourseDetails
exports.getCourseDetails = async (req,res) => {
   try {
    
     //get id.
     const {courseId} = req.body;
     //find course details.
     const courseDetails = await Course.find(
                                        { _id: courseId })
                                        .populate(
                                            {
                                                path: 'instructor',
                                                populate: {
                                                    path: 'additionalDetails'
                                                },
                                            }
                                        )    
                                        .populate('category')
                                        // .populate('ratingAndReviews')
                                        .populate(
                                            {
                                                path: 'courseContent',
                                                populate:{
                                                    path: 'subSection'
                                                },
                                            })
                                            .exec();

                     //Validation 
                     if(!courseDetails) {
                         return res.status(400).json({
                             success:false,
                             message:`could not found the course details with this courseId: ${courseId}`,
                         });
                     }

                     //return res
                     return res.status(200).json({
                         success:true,
                         message:"Course Details fetched successfully",
                         data:courseDetails,
                     });
                                        

   } catch (error) {
      console.log(error.message);
      return res.status(500).json({
         success:false,
         message:error.message,
      });
   }
};