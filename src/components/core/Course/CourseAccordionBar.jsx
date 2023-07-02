import React from "react";
import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import CourseSubSectionAccordion from "./CourseSubSectionAccordion";

const CourseAccordionBar = ({ section, isActive, handleActive }) => {
    const contentEl = useRef(null);

    // Accordian state
    const [active, setActive] = useState(false);
    const [sectionHeight, setSectionHeight] = useState(0);

    useEffect(() => {
        setActive(isActive?.includes(section._id));
    }, [isActive]);

    useEffect(() => {
        setSectionHeight(active ? contentEl.current.scrollHeight : 0);
    }, [active]);

    return (
        <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
            <div>
                <div
                    className={`flex cursor-pointer items-center justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]`}
					onClick={() => {
						handleActive(section._id);
					}}
                >
                    <div
                        className="flex items-center gap-2">
                        <i
                            className={
                                isActive.includes(section._id)
                                    ? "rotate-0"
                                    : "-rotate-90"
                            }
                        >
                            <AiOutlineDown />
                        </i>
                        <p>{section?.sectionName}</p>
                    </div>

                    <div className="space-x-4">
                        <span className="text-yellow-25">
                            {`${section.subSections.length || 0} lecture(s)`}
                        </span>
                    </div>
                </div>
            </div>

            <div
                ref={contentEl}
                // Explore below css further for more clarification
                className={`relative h-0 overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-[ease]`}
                style={{
                    height: sectionHeight,
                }}
            >
                <div className="text-textHead flex flex-col gap-2 px-7 py-6 font-semibold">
                    {section?.subSections?.map((subSec, i) => {
                        return (
                            <CourseSubSectionAccordion
                                subSec={subSec}
                                key={i}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CourseAccordionBar;
