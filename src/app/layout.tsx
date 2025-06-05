import "./globals.css";
import { ReactNode } from "react";
import { RefreshProvider, FastRefreshProvider, SlowRefreshProvider } from "@/components/RefreshContext";

export const metadata = {
  title: "Weather Dashboard",
  description: "Live sensor data viewer",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SlowRefreshProvider>
          <RefreshProvider>
            <FastRefreshProvider>
              {children}
            </FastRefreshProvider>
          </RefreshProvider>
        </SlowRefreshProvider>
      </body>
    </html>
  );
}
