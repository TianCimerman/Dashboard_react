"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

const Time = () => {
  const [time, setTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  const options = { month: 'long', day: 'numeric' };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setShowColon(prev => !prev); // toggle colon
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const dateWithoutYear = time.toLocaleDateString(undefined, options);

  return (
    <div className="flex flex-row gap-[2.5rem] items-center ml-[4rem] p-[3rem] pr-[4rem]  pl-[4rem]  hss:pr-[0rem]  hss:pl-[0rem] rounded-3xl hss:w-[38rem] hss:flex-col p-[1.2rem] gap-[0rem] " style={{ backgroundColor: 'hsl(218, 46%, 8%)' }}>
      <div className="flex flex-row gap-[3rem] hss:gap-[6rem] items-center">
      <FontAwesomeIcon icon={faClock}  className="text-[6rem] hss:text-[5.5rem] ml-[-1.8rem]" />
      <p className="text-[6rem] mr-[0.5rem] hss:text-[5.5rem]  ">
        {hours}
        <span className={`${showColon ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>:</span>
        {minutes}
      </p>
      </div>
      <div className="flex flex-row gap-[3rem] hss:gap-[6.5rem] items-center">
      <FontAwesomeIcon icon={faCalendarDays} className="text-[6rem] hss:text-[5.5rem]" />
      <p className="text-[6rem] hss:text-[5.5rem]">{dateWithoutYear}</p>
      </div>
    </div>
  );
};

export default Time;
