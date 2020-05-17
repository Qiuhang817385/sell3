import React, { useState, useEffect } from "react";

import "./App.css";
import GlobalStats from "./components/GlobalStats";
import CountriesChart from "./components/CountriesChart";
import SelectDataKey from "./components/SelectDataKey";
import useCoronaAPI from './hooks/useCoronaAPI'
import HistoryChartGroup from './components/HistoryChartGroup'

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


  const [country, setCountry] = useState(null);
  const history = useCoronaAPI(`/historical/${country}`, {
    initialData: {},
    converter: (data) => data.timeline,
  });


  return (
    <div className='App'>
      <h1>COVID-19</h1>
      <GlobalStats stats={globalStats} />
      <SelectDataKey onChange={(e) => setKey(e.target.value)} />
      <CountriesChart data={countries} dataKey={key} onClick={(payload) => {
        console.log('payload', payload)
        if (!payload) return;
        setCountry(payload.activeLabel)
      }} />
      {country ? (
        <>
          <h2>History for {country}</h2>
          <HistoryChartGroup history={history} />
        </>
      ) : (
          <h2>点击一个国家区域用于展示历史记录</h2>
        )}
    </div>
  );
}

export default App;

