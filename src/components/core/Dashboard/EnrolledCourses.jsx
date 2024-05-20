import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI.js";
import ProgressBar from "@ramonak/react-progress-bar";
function EnrolledCourses() {

    const {token} = useSelector((state) => state.auth);
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourse = async () => {
        try {
            
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);

        } catch (error) {
            console.log("Unable to fetch enrolled courses");
        }
    }

    useEffect(() => {
        getEnrolledCourse();
    }, [])
    

  return (
    <div className="text-white">
        <div> Enrolled Courses </div>
        {
            !enrolledCourses ? (
            <div>
                Loading...
            </div>) 
            : !enrolledCourses.length ? (<p>You have not enrolled in any course yet</p>)
            : (
                <div>
                    <div>
                        <p>Course Name</p>
                        <p>Durations</p>
                        <p>Progress</p>
                    </div>
                    {/* Card starting from here */}
                    {
                        enrolledCourses.map((course, index) => {
                            <div>
                                <div>
                                    <img src={course.thumbnail} alt="COURSE THUMBNAIL IMAGE" />
                                    <div>
                                         <p>{course.courseName}</p>
                                         <p>{course.courseDescription}</p>
                                    </div>

                                    <div>
                                        {course?.totalDuration}
                                    </div>

                                    <div>
                                        <p>Progress: {course.progressPercentage || 0}%</p>
                                        <ProgressBar 
                                                completed={course.progressPercentage || 0}
                                                height="8px"
                                                isLabelVisible={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            )
        }
    </div>
  )
}

export default EnrolledCourses