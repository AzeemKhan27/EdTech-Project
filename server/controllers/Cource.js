const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");

//createCourse handler function
exports.createCourse = async (req, res) => {
    try {

        //fetch data 
        const {courseName, courseDescription, whatYoutWillLearn, price, tag} = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYoutWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
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
        const categoryDetails = await Category.findById(tag);
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
            whatYouWillLearn: whatYoutWillLearn,
            price,
            tag:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

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

        //update the TAG ka schema 
        // UPDATING REST

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

exports.showAllCourses = async (req,res) => {
   try {
       const allCources = await Course.find({},{
        courseName:true,
        instructor:true,
        price:true,
        thumbnail:true,
        ratingAndReviews: true,
       })
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
