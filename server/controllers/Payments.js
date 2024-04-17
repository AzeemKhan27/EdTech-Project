const {instance} = require("../config/razorpay.js");
const Course = require("../models/Course.js");
const User = require("../models/User.js")
const mailSender = require("../utils/mailSender.js");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail.js");

//capture payment and initiate the RazarPay order:

exports.capturePayment = async (req,res) => {
    //get courseId, userId
    const { courseId } = req.body;
    const userId = req.user.id;
    //validate
    //valid courseId
    if(!courseId){
        return res.status(403).json({
            success:false,
            message:'please provide a valid course id.',
        });
    }
    //valid courseDetails
    let course;
    try {
        course = await Course.findById(courseId);
        if(!course){
            return res.status(403).json({
                success:false,
                message:'could not find the course',
            });
        }

        //user already pay for the same course.

        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(200).json({
                success:false,
                message:'you are already enrolled in this course',
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(403).json({
            success:false,
            message:error.message
        })
    }

    //order create
    const amount = course.price;
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes:{
            courseId,
            userId
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            message:'payment initiated successfully',
            courseName : course.courseName,
            courseDescription : course.courseDescription,
            thumbnail : course.thumbnail,
            orderId : paymentResponse.orderId,
            currency : paymentResponse.currency,
            amount : paymentResponse.amount,
        })
    } catch (error) {
        return res.status(500)
                  .json({
                    success:false,
                    message:error.message,
                  })
    }
};

//verify signature of razorpay and server:

exports.verifySignature = async (req,res) => {
    const webhookSecret = "12345678";
    const signature = req.headers["x-razorpay-signature"];

    //crypto configuration
    const shasum = crypto.createHmac("sha256", webhookSecret)
    shasum.update(JSON.stringify(re.body));
    const digest = shasum.digest("hex");

    //compare and match signature and digest.
    if(signatures === digest) {
        console.log("Payment Authorised.");

        const {courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            
            //fullfil the action
            //find the course and enroll the student in it.
            const enrolledCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                { $push: { studentsEnrolled: userId } },
                { new: true }
            )

            //validation
            if(!enrolledCourse){
                return res.status(403).json({
                    success:false,
                    message:'could not find the course',
                });
            }
            console.log(enrolledCourse);

            //find the student and add the course to their list enrolled courses me
            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id:userId},
                                            {$push:{courses:courseId}},
                                            {new : true},
                                        );

        // send confirmation mail to student.
        const emailResponse = await mailSender(
                                 enrolledStudent.email,
                                 "Congratulations from Ed-Tech Content Hub",
                                 "Congratulations, you are onboarded into the new Upskill Yourself course.",

        );

        console.log(emailResponse);
        return res.status(200).json({
            success: true,
            message : "Signature Verified and Course Added Successfully."
        })

            
        } catch (error) {
            return res.status(500)
                      .json({
                        success:false,
                        message:error.message
                      })
        }
    }
    else{
        return res.status(400).json({
            success:false,
            message:'Invalid Request | Signature does not match',
        })
    }


}