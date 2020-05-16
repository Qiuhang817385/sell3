// 获取当前浏览器的垂直滚动位置
import { useState, useEffect } from 'react';
function useBodyScrollPosition () {
  const [scrollPosition, setScrollPosition] = useState(null);
  // 增加节流
  const throttle = (fn, timeOut) => {
    let flag = true;
    return function () {
      if (!flag) return;
      flag = false
      setTimeout(() => {
        fn.call(this, arguments)
        flag = true
      }, timeOut)
    }
  }
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    document.addEventListener('scroll', throttle(handleScroll, 1000));
    return () =>
      document.removeEventListener('scroll', throttle(handleScroll, 1000));
  }, []);

  return scrollPosition;
}
export default useBodyScrollPosition