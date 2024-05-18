import React from 'react'

const IconBtn = ({
    text,
    onClick,
    children,
    disabled,
    outline = false,
    customClasses,
    type,

}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white bg-richblue-500 hover:bg-richblue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-richblue-500 ${customClasses}`}
    >
      {
            children ? (
                 <>
                   <span>
                      {text}
                   </span>
                      {children}
                 </>
            ) : (text)
      }
    </button>
  )
}

export default IconBtn