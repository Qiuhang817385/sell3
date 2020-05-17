import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

function CountriesChart ({ data, dataKey, onClick }) {
  // console.log('data', data)
  // console.log('onClick', onClick)
  return (
    <>
      点击国家
      <BarChart
        width={1200}
        height={250}
        style={{ margin: "auto", border: '1px solid red' }}
        margin={{ top: 30, left: 20, right: 30 }}
        data={data}
        onClick={onClick}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='country' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill='#8884d8' />
      </BarChart>
    </>
  );
}

export default CountriesChart;