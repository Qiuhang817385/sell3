// src/utils.js
// 进行对象的转换
export function transformHistory (timeline = {}) {
  return Object.entries(timeline).map((entry) => {
    const [time, number] = entry;
    return { time, number };
  });
}
/* {
  "3/28/20": 81999,
  "3/29/20": 82122
}
  [
  {
    time: "3/28/20",
    number: 81999
  },
  {
    time: "3/29/20",
    number: 82122
  }
]


*/