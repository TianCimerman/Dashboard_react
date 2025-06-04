"use client";

import React, { useEffect, useState } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { faTemperatureLow } from '@fortawesome/free-solid-svg-icons';
import { faTint } from '@fortawesome/free-solid-svg-icons';



const WeatherWidget = ({ city = "New York" }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const apiKey = "2ad521340e75e70795e40edd342d8db7";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const url = "http://192.168.1.160:8086";
    const token = "ZxiXrqG4D0hOoHOO67J7E1_wQ85v7-frrJy7AXHJkIhr7i8q4WOu4aqCPsxD844OPRLlJNq0JnBI0Z0gQH6QIw==";
    const org = "family";

  
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

    queryApi.queryRows(flux_query, {
      next(row, tableMeta) {
        rows.push(tableMeta.toObject(row));
      },
      complete() {
        setData(rows);
      },
      error(error) {
        console.error("Error", error);
      },

  }, []);
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (res.ok && data.weather && data.weather.length > 0) {
          setWeather({
            main: data.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          });
        } else {
          setError(data.message || "Weather data not available.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);
  if (loading) return <div>Loading weather...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
<div style={{ backgroundColor: 'hsl(218, 46%, 8%)' }} className="w-[33.33rem] rounded-3xl m-[2.5rem] p-[2.5rem] h-[26rem] hss:w-[26rem] ml-[1.5rem]">
  <p className="text-[3.125rem] text-center font-bold">Outside</p>
  <div className="flex flex-row pt-[1rem]">
    <div className="flex flex-col gap-[2.5rem] items-center ml-[0.225rem] pt-[1rem] p-[1.25rem] rounded-3xl" style={{ }}>
      <FontAwesomeIcon icon={faSun} size="3x" color="orange" />
      <FontAwesomeIcon icon={faTemperatureLow} size="3x" color="orange" />
      <FontAwesomeIcon icon={faTint} size="3x" color="orange" className="pr-[0.1875rem]" />
    </div>
    <div className="flex flex-col gap-[0.625rem] items-center ml-[-1rem]">
      <div className="flex flex-row gap-[1.5rem] items-center ml-[5.5rem] hss:gap-[0.5rem] ml-[2.5rem]">
        <p className="text-[2.5rem]">{weather.main}</p>
        <img src={weather.icon} alt={weather.main} />
      </div>
      <div className="flex flex-row gap-[2.5rem] items-center ">
        <p className="text-[2.5rem] hss:text-[2.4rem]">{data.find(d => d._field === "temperature_out")?._value}°C</p>
      </div>
      <div className="flex flex-row gap-[2.5rem] items-center pt-[1rem]">
        <p className="text-[2.5rem] hss:text-[2.4rem]">{data.find(d => d._field === "humidity_out")?._value}%</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default WeatherWidget;
