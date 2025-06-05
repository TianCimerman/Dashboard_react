"use client";
import { createContext, useState, useEffect, useContext } from "react";

const RefreshContext = createContext(null);

export const RefreshProvider = ({ children }) => {
  const [refreshSignal, setRefreshSignal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshSignal((prev) => prev + 1);
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <RefreshContext.Provider value={refreshSignal}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefreshSignal = () => useContext(RefreshContext);

// Second context with 10-second interval
const FastRefreshContext = createContext(null);

export const FastRefreshProvider = ({ children }) => {
  const [fastRefreshSignal, setFastRefreshSignal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFastRefreshSignal((prev) => prev + 1);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <FastRefreshContext.Provider value={fastRefreshSignal}>
      {children}
    </FastRefreshContext.Provider>
  );
};

export const useFastRefreshSignal = () => useContext(FastRefreshContext);

// Second context with 10-second interval
const SlowRefreshContext = createContext(null);

export const SlowRefreshProvider = ({ children }) => {
  const [SlowRefreshSignal, setSlowRefreshSignal] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlowRefreshSignal((prev) => prev + 1);
    },  86,400000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <SlowRefreshContext.Provider value={SlowRefreshSignal}>
      {children}
    </SlowRefreshContext.Provider>
  );
};

export const useSlowRefreshSignal = () => useContext(SlowRefreshContext);