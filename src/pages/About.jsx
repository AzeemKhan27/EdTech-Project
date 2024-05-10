import React from 'react'
import HighlightText from "../components/core/HomePage/HighlightText.jsx"

function About() {
  return (
    <div className='mx-auto mt-[100px] text-white'>
    {/* section - 1 */}
      <section>
        <div>
            <header>
                Driving Innovation in Online Education for a
                <HighlightText text={"Brighter Future"}/>
                <p>Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </header>
        </div>
      </section>
    </div>
  )
}

export default About