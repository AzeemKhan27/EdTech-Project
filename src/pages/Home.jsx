
import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import  HighlightText  from "../components/core/HomePage/HighlightText.jsx";
import  CTAButton  from "../components/core/HomePage/Button.jsx";
import Banner from "../assets/Images/banner.mp4"


function Home() {
  return (
     <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>
        {/* Section-1 */}
        
            <Link to={"/signup"}>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p className="shadow-[10px_5px_2px]">Become an Instructor</p>
                        <FaArrowRight />
                    </div>

                </div>
            </Link>

            <div className="text-center text-4xl font-semibold mt-7">
                    Empower Your Future With
                    {" "}
                    <HighlightText text={"Coding Skills"} />
            </div>

            <div className="mt-4 w-[90%] text-center text-lg font-bold text-richblack-300">
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
            </div>

            <div className='flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}> 
                    Learn More 
                </CTAButton>

                <CTAButton active={false} linkto={"/login"}> 
                    Book a Demo 
                </CTAButton>
            </div>

            <div className = "mx-3 my-12 shadow-blue-500">
                <video 
                  muted
                  loop
                  autoPlay
                >
                <source src={Banner} type="video/mp4" />
                </video>
            </div>

            {/* Code Section 1 */}

            <div>
                <CodeBlocks />
            </div>

        {/* Section-2 */}
        {/* Section-3 */}
        {/* Section-4 */}
        {/* Section-5 */}
     </div>
  )
}

export default Home