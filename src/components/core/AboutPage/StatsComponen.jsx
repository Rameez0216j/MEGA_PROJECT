import React from "react";

const Stats = [
  { count: "5K", label: "Active students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];

const StatsComponen = () => {
  return (
    <div>
      <div className=" text-white bg-richblack-800">
        <div className="max-w-7xl flex gap-x-5 mx-auto justify-between">
          {Stats.map((data, index) => {
            return (
              <div key={index} className="p-24 text-center">
                <h1 className="text-4xl font-semibold">{data.count}</h1>
                <h2 className="text-base text-richblack-200">{data.label}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StatsComponen;
