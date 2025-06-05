"use client";

import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { InfluxDB } from '@influxdata/influxdb-client';

const TemperatureGauge = () => {
  const [power, setPower] = useState(null);

  useEffect(() => {
    const url = "http://192.168.1.160:8086";
    const token = "ZxiXrqG4D0hOoHOO67J7E1_wQ85v7-frrJy7AXHJkIhr7i8q4WOu4aqCPsxD844OPRLlJNq0JnBI0Z0gQH6QIw==";
    const org = "family";
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

    const fluxQuery = `
      from(bucket: "data")
        |> range(start: -1h)
        |> filter(fn: (r) => r["_measurement"] == "meter_data2")
        |> filter(fn: (r) => r["_field"] == "power2")
        |> last()
        |> keep(columns: ["_value"])
    `;

    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const record = tableMeta.toObject(row);
        console.log("Influx row:", record); // ✅ Log what's coming from Influx
        setPower(parseFloat(record._value));
      },
      error(error) {
        console.error("InfluxDB query error:", error);
      },
      complete() {
        console.log("Query completed");
      },
    });
  }, []);
  console.log("Power:", power);
  const minValue = -15;
  const maxValue = 15;

  const percent =
    power !== null ? (power - minValue) / (maxValue - minValue) : 0.5;

return (
  <div 
    
    className=" flex flex-col w-[59rem] pt-5 px-10 rounded-3xl hss:w-[42rem] h-[30rem ] flex justify-center gap-[0.8rem]" 
    style={{ backgroundColor: 'hsl(218, 46%, 8%)' }}
  >
    <p className="text-[2.8rem] text-center font-bold">Power consumption</p>
    <GaugeChart
      id="custom-gauge"
      nrOfLevels={3}
      arcsLength={[0.5, 0.35, 0.15]}
      colors={['#00FF00', '#FFBF00', '#FF0000']}
      percent={percent}
      formatTextValue={() =>
        power !== null ? `${power} W` : 'Loading...'
      }
      arcPadding={0.02}
      arcWidth={0.3}
      textColor="#FFFFFF"
      needleColor="#999999"
      needleBaseColor="#999999"
    />
  </div>
);


};

export default TemperatureGauge;
