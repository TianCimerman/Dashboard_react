"use client";

import React, { useEffect, useState } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faTemperatureLow, faTint } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRefreshSignal } from "@/components/RefreshContext";
import { useSlowRefreshSignal } from "@/components/RefreshContext";







const WeatherWidget = ({ city = "New York" }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const apiKey = "2ad521340e75e70795e40edd342d8db7";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const refreshSignal = useRefreshSignal(); // triggers every 1 min
  const refreshSignalSlow = useSlowRefreshSignal(); // triggers every 1 min
  const [voltageIn, setVoltageIn] = useState(null);
  const [voltageOut, setVoltageOut] = useState(null);



  useEffect(() => {
    const url = "http://192.168.1.160:8086";
    const token = "ZxiXrqG4D0hOoHOO67J7E1_wQ85v7-frrJy7AXHJkIhr7i8q4WOu4aqCPsxD844OPRLlJNq0JnBI0Z0gQH6QIw==";
    const org = "family";

    const fetchData = async () => {
      const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

      const flux_query = `
        from(bucket: "data")
          |> range(start: -1d)
          |> filter(fn: (r) => r["_measurement"] == "climate_2")
          |> filter(fn: (r) => r["_field"] ==  "humidity_out" or r["_field"] == "temperature_out" or r["_field"] == "voltage_out" or r["_field"] == "voltage_in")
          |> last()
          |> keep(columns: ["_field", "_value"])
      `;

      const rows = [];
      try {
        await new Promise((resolve, reject) => {
          queryApi.queryRows(flux_query, {
            next(row, tableMeta) {
              rows.push(tableMeta.toObject(row));
            },
            error(err) {
              console.error("Error querying InfluxDB:", err);
              reject(err);
            },
            complete() {
              resolve();
            },
          });
        });

        setData(rows);

      const voltageInValue = parseFloat(rows.find((d) => d._field === "voltage_in")?._value ?? NaN);
      const voltageOutValue = parseFloat(rows.find((d) => d._field === "voltage_out")?._value ?? NaN);

      setVoltageIn(voltageInValue);
      setVoltageOut(voltageOutValue);





      } catch (err) {
        setError("Error fetching sensor data");
      }

      // Fetch weather data
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const weatherData = await res.json();

        if (res.ok && weatherData.weather && weatherData.weather.length > 0) {
          setWeather({
            main: weatherData.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
          });
          setError(null);
        } else {
          setError(weatherData.message || "Weather data not available.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch immediately

    const intervalId = setInterval(fetchData, 60 * 1000); // Repeat every 60 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [city, refreshSignal]);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    const today = new Date().toISOString().slice(0, 10); // e.g., "2025-06-05"
    const lastShownDate = localStorage.getItem("dailyToastDate");  
   // Only show if it's a new day and we have voltage data
   console.log(  "ddddd" ,voltageIn);
   console.log( "ddddd" ,voltageOut);
    if ( lastShownDate!==today && voltageIn !== null && voltageOut !== null) {
        if (voltageIn < 12) {
            toast.error("Daily Alert: Low Voltage (IN)");
            }
        if (voltageOut < 12) {
            toast.error("Daily Alert: Low Voltage (OUT)");
            }

            localStorage.setItem("dailyToastDate", today);
            console.log("Daily toast shown for date:", today);
            }
          }, [voltageIn, voltageOut, refreshSignal]);
        






  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error: {error}</div>;

  



  return (
 


      <div
        style={{ backgroundColor: 'hsl(218, 46%, 8%)' }}
        className="w-[33.33rem] rounded-3xl m-[2.5rem] p-[2.5rem] h-[26rem] hss:w-[26rem] ml-[1.5rem]"
      >
              <ToastContainer position="top-right" autoClose={false} />
        <p className="text-[3.125rem] text-center font-bold">Outside</p>
        <div className="flex flex-row pt-[1rem]">
          <div className="flex flex-col gap-[2.5rem] items-center ml-[0.225rem] pt-[1rem] p-[1.25rem] rounded-3xl">
            <FontAwesomeIcon icon={faSun} size="3x" color="orange" />
            <FontAwesomeIcon icon={faTemperatureLow} size="3x" color="orange" />
            <FontAwesomeIcon icon={faTint} size="3x" color="orange" className="pr-[0.1875rem]" />
          </div>
          <div className="flex flex-col gap-[0.625rem] items-center ml-[-1rem]">
            <div className="flex flex-row gap-[1.5rem] items-center ml-[5.5rem] hss:gap-[0.5rem] ml-[2.5rem]">
              <p className="text-[2.5rem]">{weather?.main}</p>
              <img src={weather?.icon} alt={weather?.main} />
            </div>
            <div className="flex flex-row gap-[2.5rem] items-center ">
              <p className="text-[2.5rem] hss:text-[2.4rem]">
                {data.find(d => d._field === "temperature_out")?._value}°C
              </p>
            </div>
            <div className="flex flex-row gap-[2.5rem] items-center pt-[1rem]">
              <p className="text-[2.5rem] hss:text-[2.4rem]">
                {data.find(d => d._field === "humidity_out")?._value}%
              </p>
            </div>
          </div>
        </div>
      </div>

  );
};

export default WeatherWidget;
