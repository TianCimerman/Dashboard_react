"use client";

import React, { useEffect, useState } from "react";
import { InfluxDB } from "@influxdata/influxdb-client";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureLow } from '@fortawesome/free-solid-svg-icons';
import { faTint } from '@fortawesome/free-solid-svg-icons';
import { useRefreshSignal } from "@/components/RefreshContext";


const Inside_Temp =() => {


  const [data, setData] = useState([]);
    const refreshSignal = useRefreshSignal(); // ✅ triggers every 1 min


 useEffect(() => {
    const url = "http://192.168.1.160:8086";
    const token = "ZxiXrqG4D0hOoHOO67J7E1_wQ85v7-frrJy7AXHJkIhr7i8q4WOu4aqCPsxD844OPRLlJNq0JnBI0Z0gQH6QIw==";
    const org = "family";

  
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

    const flux_query = `
    from(bucket: "data")
      |> range(start: -1d)
      |> filter(fn: (r) => r["_measurement"] == "climate_2")
      |> filter(fn: (r) => r["_field"] ==  "humidity_in" or r["_field"] == "temperature_in")
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
    });
  }, [refreshSignal]);

  return (
<div style={{ backgroundColor: 'hsl(218, 46%, 8%)' }} className="w-[33rem] rounded-3xl m-[2.5rem] p-[1.5rem] h-[20rem] hss:w-[26rem] ml-[1.5rem] ">
  <p className="text-[3.125rem] text-center font-bold">Inside</p>
  <div className="flex flex-row pt-[2rem]">
    <div className="flex flex-col gap-[2.5rem] items-center ml-[1.5rem] pt-[1rem] p-[1.25rem] rounded-3xl w-[5rem]">
      <FontAwesomeIcon icon={faTemperatureLow} size="3x" color="orange" />
      <FontAwesomeIcon icon={faTint} size="3x" color="orange" className="pr-[0.1875rem]" />
    </div>
    <div className="flex flex-col gap-[0.625rem] items-center ml-[5rem] pt-[0.5rem]">
      <div className="flex flex-row gap-[2rem] items-center">
        <p className="text-[2.5rem] hss:text-[2.4rem]">{data.find(d => d._field === "temperature_in")?._value}°C</p>
      </div>
      <div className="flex flex-row gap-[2.5rem] items-center pt-[1rem] ">
        <p className="text-[2.5rem] hss:text-[2.4rem]">{data.find(d => d._field === "humidity_in")?._value}%</p>
      </div>
    </div>
  </div>
</div>

  );
};

export default Inside_Temp;