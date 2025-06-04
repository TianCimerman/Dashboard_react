
"use client";

import React, { useEffect} from 'react';
import WeatherWidget from "@/components/outside";
import Inside_Temp from "@/components/inside";
import Time from "@/components/time";
import TemperatureGauge from "@/components/power";
import Navbar from '@/components/navbar';

function App() {
    useEffect(() => {
      document.body.classList.add("overflow-hidden");

      return () => {
        document.body.classList.remove("overflow-hidden"); // Cleanup
      };
    }, []);


  return (
<div className="min-h-screen bg-[#303946] mt-[-1rem] " >

  <div className=" flex flex-col md:flex-row items-start  gap-10 hss:ml-5  ">
    <WeatherWidget city="Dobovica" />
    <div className=" md:mt-[3rem] md:ml-[-4rem]">
      <Time />
    </div>
  </div>

  {/* Inside Temp + Gauge + Navbar */}
  <div className="flex flex-col md:flex-row gap-10 mt-4 md:mt-[-1rem] hss:ml-5">
    <div className="mt-1 md:mt-[-2rem]">
      <Inside_Temp />
    </div>
    <div className="mt-[-10rem] hss:mt-[-2rem] ">
      <TemperatureGauge />
    </div>
    <div className="w-full md:w-[20rem] mt-2 md:mt-[-8rem]">
      <Navbar />
    </div>
  </div>
</div>

    
  );
}


export default App;
