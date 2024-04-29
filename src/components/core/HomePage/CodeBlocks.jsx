import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { TypeAnimation } from 'react-type-animation';

const CodeBlocks = ({
    position, heading, subheading, ctabtn1, ctabtn2, codeblock, backgroundGradient, codeColor
}) => {
  return (
    <div className={`flex ${position} my-20 justify-between gap-10`}>
        {/* Section 1 */}   
        <div className="w-[50%] flex flex-col gap-8">
            {heading}

            <div className="text-richblack-300 font-bold">
              {subheading}
            </div>
            
            <div className="flex gap-7 mt-7">
                <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
                    <div className="flex gap-2 items-center">
                       {ctabtn1.btnText}
                       <FaArrowRight />
                    </div>
                </CTAButton>

                <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
                    
                       {ctabtn2.btnText}
                   
                </CTAButton>
            </div>

        </div>

        {/* Section 2 */}   
        <div className='h-fit flex flex-row text-[10px] w-[100%] py-4 lg:w-[500px]' style={{ background: 'radial-gradient(circle at center, #ff0000, #0000ff)' }} >
            {/* Gradiant circle */}
            <div className="text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
             
              {/* Indexing  */}
               {Array.from({ length:11 }, (_,index) => (
                   <p key={index}>{index+1}</p>
               ))}

            </div>

            <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}>
                <TypeAnimation
                sequence={[codeblock,2000,""]}
                repeat={Infinity}   
                cursor={true}

                style = {
                    {
                        whiteSpace: "pre-line",
                        display:"block"
                    }
                }
                omitDeletionAnimation={true}
                />
            </div>
        </div>

    </div>
  )
}

export default CodeBlocks;