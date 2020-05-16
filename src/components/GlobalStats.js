import React from "react";

function Stat ({ number, color }) {
  return <span style={{ color: color, fontWeight: "bold" }}>{number}</span>;
}

function GlobalStats ({ stats }) {
  const { cases, deaths, recovered, active, updated } = stats;

  return (
    <div className='global-stats'>
      <small>Updated on {new Date(updated).toLocaleString()}</small>
      <table>
        <tr>
          <td>
            累积确诊病例: <Stat number={cases} color='red' />
          </td>
          <td>
            累积死亡病例: <Stat number={deaths} color='gray' />
          </td>
          <td>
            治愈人数: <Stat number={recovered} color='green' />
          </td>
          <td>
            现存确诊人数: <Stat number={active} color='orange' />
          </td>
        </tr>
      </table>
    </div>
  );
}

export default GlobalStats;