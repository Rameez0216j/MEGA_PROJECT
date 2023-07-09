import React from "react";
import CTAButton from "../HomePage/Button";
import HighlightedText from "./HighlightedText";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

const codeTyping="";

const CodeBlocks = ({
    position,
    heading,
    subheading,
    ctabtn1,
    ctabtn2,
    codeblock,
    backgroundGradient,
    codeColor,
}) => {
    return (
        <div className={`flex ${position} my-20 mx-12 justify-between gap-10`}>
            {/* Section-1 */}
            <div className="w-[50%] flex flex-col gap-8">
                {heading}
                <div className="text-richblack-300 font-bold">{subheading}</div>

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

            {/* Section-2 */}
            <div className="relative h-fit flex flex-row text-10 w-[100%] py-4 lg:w-[600px] bg-gradient-to-br from-[#0E1A2D] to-[#111E32] code-border">
                <div className="text-center h-[100%] flex flex-col w-[10%] text-richblack-400 font-inter font-bold">
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                </div>
                <div
                    className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-2`}
                >
                    {/* Testing */}
                    <TypeAnimation
                        sequence={[`<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<link rel="stylesheet" href="style.css">\n\t<title>Learn New Skills</title>\n</head>\n<body>\n\t<h1><a src="skillspoint/">Learn</a></h1>\n</body>\n</html>`, 2000," "]}
                        repeat={Infinity}
                        cursor={true}
                        style={{
                            whiteSpace: "pre-wrap", // for /n to work
                            display: "block",
                            color:"white",
                        }}
                        omitDeletionAnimation={true}
                    />


                    {/* <TypeAnimation
                        sequence={[codeblock, 2000," "]}
                        repeat={Infinity}
                        cursor={true}
                        style={{
                            whiteSpace: "pre-wrap", // for /n to work
                            display: "block",
                        }}
                        omitDeletionAnimation={true}
                    /> */}
                </div>

                {/* spolight */}
                <div className={`absolute ${backgroundGradient} h-[350px] w-[400px] left-[-10%] top-[-15%] opacity-[0.10] rounded-full blur-[50px]`}></div>
            </div>
        </div>
    );
};

export default CodeBlocks;
