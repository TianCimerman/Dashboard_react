
![HomeAutomation](https://github.com/user-attachments/assets/de01bad8-057f-4c11-bcea-a74cd66fdf1d)


ESP32 + Si7021 (vlažnost & temperatura)

-Napajanje: 18650 Li-ion baterija

-Senzor: Si7021

-Krmilnik: ESP32 DevKit

Delovanje: Periodično meri temperaturo in vlažnost ter pošilja podatke prek WiFi na InfluxDb.



Raspberry Pi 5 - Backend (InfluxDB, Grafana, Web Server)

-Sprejema podatke iz ESP32 in shranjuje jih v InfluxDB.

-Vizualizacija podatkov s pomočjo Grafana dashboarda.

-Gosti tudi spletno stran do dashboard.

Source code: https://github.com/TianCimerman/Dashboard_react

Source code: https://github.com/TianCimerman/SolarEdge-ModBusRead









Raspberry Pi - Kiosk Mode Display

-V dnevni sobi prikaže trenutno temperaturo in vlažnost, porabo enrgije...

-Frontend narejen v Reactu.

-Deluje v Raspberry Pi "Kiosk Mode" (Chromium v fullscreen načinu, samodejni zagon).




ESP32 + Si7021 (Humidity & Temperature Sensor)

-Power Supply: 18650 Li-ion battery

-Sensor: Si7021

-Microcontroller: ESP32 DevKit

-Function: Periodically measures temperature and humidity and sends the data via WiFi to the InfluxDB.

Source code: https://github.com/TianCimerman/FireB_Sensor


Raspberry Pi 5 – Backend (InfluxDB, Grafana, Web Server)

-Receives data from the ESP32 and stores it in InfluxDB.

-Visualizes data using Grafana dashboards.

-Hosts a web server that serves the dashboard frontend.

Source code: https://github.com/TianCimerman/Dashboard_react

Source code: https://github.com/TianCimerman/SolarEdge-ModBusRead



Raspberry Pi – Kiosk Mode Display

-Displays current temperature, humidity, and energy consumption in the living room.

-Frontend built using React.

-Runs in "Kiosk Mode" (Chromium in fullscreen, auto-start on boot).



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
