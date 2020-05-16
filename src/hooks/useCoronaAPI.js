import { useState, useEffect, useCallback, useMemo } from "react";
// 共享从 NovelCOVID 19 API 获取数据的逻辑。
const BASE_URL = "https://corona.lmao.ninja/v2";
// 这里的useEffect留了一个坑

export default function useCoronaAPI (
  path,
  { initialData = null, converter = (data) => data, refetchInterval = null }
  /* 
    initialData ：初始为空的默认数据
    converter ：对原始数据的转换函数（默认是一个恒等函数）
    refetchInterval ：重新获取数据的间隔（以毫秒为单位）
   */
) {
  const [data, setData] = useState(initialData);
  // converter这里不难传递这个函数做优化
  // const convertData = useCallback(converter, []);
  // const convertData = useCallback((v) => {
  //   converter(v)
  // }, [converter]);

  const convertData = useMemo(() => {
    return converter
  }, []);

  console.log('执行了')
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${BASE_URL}${path}`);
      const data = await response.json();
      setData(convertData(data));
      // console.log('convertData(data)', convertData)
    };
    fetchData();
    if (refetchInterval) {
      const intervalId = setInterval(fetchData, refetchInterval);
      return () => clearInterval(intervalId);
    }
  }, [convertData, path, refetchInterval]);

  return data;
}