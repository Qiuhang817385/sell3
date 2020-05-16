import React, { useState, useEffect } from "react";

import "./App.css";
import GlobalStats from "./components/GlobalStats";
import CountriesChart from "./components/CountriesChart";
import SelectDataKey from "./components/SelectDataKey";
import useCoronaAPI from './hooks/useCoronaAPI'

/**
 * 自定义Hook
 */
import useBodyScrollPosition from './hooks/useBodyScrollPosition'

// const BASE_URL = "https://corona.lmao.ninja/v2";

function App () {
  // 钩子
  // const [globalStats, setGlobalStats] = useState({});

  const globalStats = useCoronaAPI("/all", {
    initialData: {},
    refetchInterval: 5000,
  });


  const [key, setKey] = useState("cases");
  // const [countries, setCountries] = useState([]);
  const countries = useCoronaAPI(`/countries?sort=${key}`, {
    initialData: [],
    converter: (data) => data.slice(0, 10),
  });



  const height = useBodyScrollPosition();


  useEffect(() => {
    console.log('height', height)
  }, [height])

  /**
   * 获取数据
   */
  // useEffect(() => {
  //   const fetchGlobalStats = async () => {
  //     const response = await fetch(`${BASE_URL}/all`);
  //     const data = await response.json();
  // setGlobalStats(data);
  // };
  // 先调用一次
  //   fetchGlobalStats();
  //   const intervalId = setInterval(fetchGlobalStats, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);

  /**
   * 获取国家
   */
  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     const response = await fetch(`${BASE_URL}/countries?sort=${key}`);
  //     const data = await response.json();
  //     // console.log('data', data)
  //     // 只获取10个,获取1次
  //     setCountries(data.slice(0, 10));
  //   };

  //   fetchCountries();
  // }, [key]);
  // console.log('globalStats', globalStats)
  return (
    <div className='App'>
      <h1>COVID-19</h1>
      <GlobalStats stats={globalStats} />
      <SelectDataKey onChange={(e) => setKey(e.target.value)} />
      <CountriesChart data={countries} dataKey={key} />
    </div>
  );
}

export default App;

