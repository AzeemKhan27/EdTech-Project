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

//getAllRating