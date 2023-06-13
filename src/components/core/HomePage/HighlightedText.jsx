import React from 'react'

const HighlightedText = ({text}) => {
  return (
    <span className='font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]'>
      <span>{" "}{text}{" "}</span>
    </span>
    // <span className='font-bold text-richblue-300'>
    //   <span>{" "}{text}{" "}</span>
    // </span>
  )
}

export default HighlightedText;