const RatingAndReviews = require("../models/RatingAndRaview.js");
const Course = require("../models/Course.js");

//createRating
exports.createRating = async(req,res)=>{
   try {
     // get user id
     const userId = req.user.id;
     // fetchData from body
     const { rating, review, courseId } = req.body;
     // check if user is enrolled in course or not.
     const courseDetails = await Course.findOne(
                                          {_id: courseId,
                                          studentsEnrolled : {$eleMatch: {$eq : userId} },
                                         })
     if(!courseDetails){
         return res.status(400).json({
             success:false,
             message:'Student is not enrolled in this course.'
         })
     }
     // check if user is already reviewed or not.
 
     const alreadyReviewed = await RatingAndReviews.findOne(
                                                     {
                                                         _id: userId,
                                                         course : courseId,
                                                     }
                                                 );
     if(!alreadyReviewed){
         return res.status(403).json({
             success:false,
             message:'You already reviwed so now you have not reviewed this course.'
         })
     }                                            
 
     // create rating and review
     const ratingAndReview = await RatingAndReviews.create({
                                                 rating,
                                                 review,
                                                 course: courseId,
                                                 user: userId,
                                             });
     
     // update course with this rating/review
     await Course.findByIdAndUpdate({_id: courseId},
                                    { 
                                       $push: {
                                         ratingAndReviews : ratingAndReview._id,
                                       }
                                    },
                                    { new : true }
                                   );
     //return response
     return res.status(200).json({
         success : true,
         message : 'Rating and review created successfully.',
         ratingAndReview
     })
   } catch (error) {
     console.error(error.message);
     return res.status(500).json({
         success : false,
         message : 'Internal Server Error',
         error : error.message,
     })
   }
}

//getAverageRating

exports.getAverageRating = async(req, res) => {
   //get courseId
   const { courseId } = req.body;
   //calculate average rating
   const result = await RatingAndReviews.aggregate([
    {
        $match:{
            courses : new mongoose.Types.ObjectId(courseId)
        },
    },
    {
        $group:{
            _id: null,
            averageRating:{
                $avg: "$rating"
            }
        }
    }
   ]);

   //return response
   if(result.length > 0){
      return res.status(200).json({
          success : true,
          message : 'Average rating is '+result[0].averageRating,
          averageRating : result[0].averageRating
      })
   }
   //if no rating/review exist
   return res.status(200).json({
        success : true,
        message : 'Average rating is 0, no ratings are given till now.',
        averageRating : 0
   })
}

//getAllRatingAndReviews

exports.getAllRating = async (req,res) => {
 try {
      const allReviews = await RatingAndReviews.find({})
                                               .sort({rating: "desc"})
                                               .populate({
                                                   path: "User",
                                                   select: "firstName lastName email image"
                                               })
                                               .populate({
                                                  path: "Course",
                                                  select: "courseName"
                                               })
                                               .exec();
            return res.status(200).json({
                success : true,
                message : 'All reviews fetched successfully.',
                data: allReviews
            });                                   
 } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success : false,
      message : 'Internal Server Error',
      error : error.message,    
    })
 }
}