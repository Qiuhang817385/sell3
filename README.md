Hook-Project

## COVID-19（新冠肺炎）可视化应用

```js
yarn install

yarn start
```

## React 函数式组件的运行过程。

函数式组件严格遵循 `UI = render(data)` 的模式。当我们第一次调用组件函数时，触发**初次渲染**；然后随着 `props` 的改变，便会重新调用该组件函数，触发**重渲染**。

而每一次渲染都是完全独立的。



但是有了hooks

函数组件可以**从组件之外把状态和修改状态的函数“钩”过来**！**通过调用 Setter 函数（也就是setState），居然还可以直接触发组件的重渲染**！



### usState执行的是浅比较

```js

import React, { useState, useEffect } from 'react'

export default function App () {
  const [obj, setObj] = useState({ count: 12 });
  const [count2, setCount2] = useState(0);
  const click = () => {
    setObj({ count: 12 })
  }
  const click2 = () => {
    setCount2(0)
  }
  useEffect(() => {
    console.log('执行了1')	每次都会执行
  }, [obj])
  useEffect(() => {
    console.log('执行了2')	只执行1次
  }, [count2])

  return (
    <div>
      {obj.count}
      <button onClick={click}>++</button>
      <button onClick={click2}>++++</button>
    </div>
  )
}
```





### effect

- 每个 Effect 必然在渲染之后执行，因此不会阻塞渲染，提高了性能
- 在运行每个 Effect 之前，运行前一次渲染的 Effect Cleanup 函数（如果有的话）
- 当组件销毁时，运行最后一次 Effect 的 Cleanup 函数

如果你熟悉 React 的重渲染机制，那么应该可以猜到 `deps` 数组在判断元素是否发生改变时同样也使用了 `Object.is` 进行比较。因此一个隐患便是，当 `deps` 中某一元素为非原始类型时（例如函数、对象等），**每次渲染都会发生改变**，从而失去了 `deps` 本身的意义（条件式地触发 Effect）。我们会在接下来讲解如何规避这个困境。



需要注意的点：

1. 我们通过定义了一个 `fetchGlobalStats` 异步函数并进行调用从而获取数据，而不是直接把这个 async 函数作为 `useEffect` 的第一个参数；
2. 创建了一个 Interval，用于每 5 秒钟重新获取一次数据；
3. 返回一个函数，用于销毁之前创建的 Interval。

此外，第二个参数（依赖数组）为空数组，因此整个 Effect 函数只会运行一次。

> **注意**
>
> 有时候，你也许会不经意间把 Effect 写成一个 async 函数：
>
> ```
> useEffect(async () => {
>   const response = await fetch('...');
>   // ...
> }, []);
> ```
>
> 这样可以吗？**强烈建议你不要这样做**。`useEffect` 约定 Effect 函数要么没有返回值，要么返回一个 Cleanup 函数。而这里 async 函数会隐式地返回一个 Promise，直接违反了这一约定，会造成不可预测的结果。





![微信图片_20200516112919](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200516112919.gif)

注意以下要点：

1. 在初次渲染时，我们通过 `useState` 定义了多个状态；
2. 每调用一次 `useState` ，都会在组件之外生成一条 Hook 记录，同时包括状态值（用 `useState` 给定的初始值初始化）和修改状态的 Setter 函数；
3. 多次调用 `useState` 生成的 Hook 记录形成了一条**链表**；
4. 触发 `onClick` 回调函数，调用 `setS2` 函数修改 `s2` 的状态，不仅修改了 Hook 记录中的状态值，还即将**触发重渲染**。

OK，重渲染的时候到了，动画如下：![微信图片_20200516112925](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200516113123.gif)

**提示**

当你充分理解上面两个动画之后，其实就能理解为什么这个 Hook 叫 `useState` 而不是 `createState` 了——之所以叫 `use` ，是因为没有的时候才创建（初次渲染的时候），有的时候就直接读取（重渲染的时候）。

- 状态和修改状态的 Setter 函数两两配对，并且后者一定影响前者，前者只被后者影响，作为一个整体它们完全不受外界的影响
- 鼓励细粒度和扁平化的状态定义和控制，对于代码行为的可预测性和可测试性大有帮助
- 除了 `useState` （和其他钩子），函数组件依然是实现渲染逻辑的“纯”组件，对状态的管理被 Hooks 所封装了起来

###  useEffect 的本质

### ![微信图片_20200516113123](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200516121614.gif)

细节：

1. `useState` 和 `useEffect` 在每次调用时都被添加到 Hook 链表中；
2. `useEffect` 还会额外地在一个队列中添加一个等待执行的 Effect 函数；
3. 在渲染完成后，依次调用 Effect 队列中的每一个 Effect 函数。

至此，上一节的动画中那两个“问号”的身世也就揭晓了——只不过是**链表**罢了！回过头来，我们想起来 React 官方文档 Rules of Hooks 中强调过一点：

> Only call hooks at the top level. 只在最顶层使用 Hook。

具体地说，不要在循环、嵌套、条件语句中使用 Hook——因为这些动态的语句很有可能会导致每次执行组件函数时调用 Hook 的顺序不能完全一致，导致 Hook 链表记录的数据失效。



## React Hooks 背后的实现机制——**链表**







## 自定义hook

自定义 Hook 具有以下特点：

- 表面上：一个命名格式为 `useXXX` 的函数，但不是 React 函数式组件
- 本质上：内部通过使用 React 自带的一些 Hook （例如 `useState` 和 `useEffect` ）来实现某些通用的逻辑

自定义 Hook：DOM 副作用修改/监听、动画、请求、表单操作、数据存储等等。

> **提示**
>
> 这里推荐两个强大的 React Hooks 库：**React Use**[6] 和 **Umi Hooks**[7]。它们都实现了很多生产级别的自定义 Hook，非常值得学习。

我想这便是 React Hooks 最大的魅力——通过几个内置的 Hook，你可以按照某些约定进行任意组合，“制造出”任何你真正需要的 Hook，或者调用他人写好的 Hook，从而轻松应对各种复杂的业务场景。就好像大千世界无奇不有，却不过是由一百多种元素组合而成。



```js
[6]
React Use: https://github.com/streamich/react-use
[7]
Umi Hooks: https://github.com/umijs/hooks
```

在组件初次渲染时的情形：

![微信图片_20200516121614](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200516112925.gif)

我们在 `App` 组件中调用了 `useCustomHook` 钩子。可以看到，**即便我们切换到了自定义 Hook 中，Hook 链表的生成依旧没有改变**。再来看看重渲染的情况：

同样地，即便代码的执行进入到自定义 Hook 中，我们依然可以从 Hook 链表中读取到相应的数据，这个”配对“的过程总能成功。

我们再次回味一下 Rules of Hook。它规定只有在两个地方能够使用 React Hook：

1. React 函数组件
2. 自定义 Hook

第一点我们早就清楚了，第二点通过刚才的两个动画相信你也明白了：**自定义 Hook 本质上只是把调用内置 Hook 的过程封装成一个个可以复用的函数，并不影响 Hook 链表的生成和读取**。



## reducer函数的规则

Reducer 函数有**两个必要规则**：

- 只返回一个值
- 不修改输入值(入参)，而是返回新的值

```js
// 不是 Reducer 函数！
function buy(cart, thing) {
  cart.push(thing);
  return cart;
}

// 正宗的 Reducer 函数
function buy(cart, thing) {
  return cart.concat(thing);
}
```

实际上在 React 的源码中，`useState` 的实现使用了 `useReducer`

在 **React 源码**[8]中有这么一个关键的函数 `basicStateReducer`（去掉了源码中的 **Flow**[9] 类型定义）

```js
function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}
```

```js
于是，当我们通过 setCount(prevCount => prevCount + 1) 改变状态时，传入的 action 就是一个 Reducer 函数，然后调用该函数并传入当前的 state，得到更新后的状态。而我们之前通过传入具体的值修改状态时（例如 setCount(5)），由于不是函数，所以直接取传入的值作为更新后的状态。
```

```js
action === (prevCount)=>(prevCount + 1)
```

![微信图片_20200517144401](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200517150927.png)

当传入 Setter 的是一个 Reducer 函数的时候：

![微信图片_20200517144452](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200517144401.gif)

### Redux 基本思想



![微信图片_20200517150927](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200517144452.gif)

可以看到，每个组件都有自己的 State（状态）和 State Setter（状态修改函数），这意味着跨组件的状态读取和修改是相当麻烦的。而 Redux 的核心思想之一就是将状态放到**唯一的全局对象**（一般称为 Store）中，而修改状态则是调用对应的 Reducer 函数去更新 Store 中的状态，大概就像这样：

![微信图片_20200517150948](https://qiuhangmarkdown.oss-cn-hangzhou.aliyuncs.com/markdowm/微信图片_20200517150948.gif)

上面这个动画描述的是组件 A 改变 B 和 C 中状态的过程：

- 三个组件挂载时，从 Store 中**获取并订阅**相应的状态数据并展示（注意是**只读**的，不能直接修改）
- 用户点击组件 A，触发事件监听函数
- 监听函数中派发（Dispatch）对应的动作（Action），传入 Reducer 函数
- Reducer 函数返回更新后的状态，并以此更新 Store
- 由于组件 B 和 C 订阅了 Store 的状态，所以重新获取更新后的状态并调整 UI

> **提示**
>
> 这篇教程不会详细地讲解 Redux，想要深入学习的同学可以阅读我们的**《Redux 包教包会》**[15]系列教程。

## 假设我们要做一个支持*撤销*和*重做*的编辑器，它的 `init` 函数和 Reducer 函数分别如下：

```js
// 用于懒初始化的函数
function init(initialState) {
  return {
    past: [],
    present: initialState,
    future: [],
  };
}

// Reducer 函数
function reducer(state, action) {
  const { past, future, present } = state;
  switch (action.type) {
    case 'UNDO':
      return {
        past: past.slice(0, past.length - 1),
        present: past[past.length - 1],
        future: [present, ...future],
      };
    case 'REDO':
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };
    default:
      return state;
  }
}
```





## 重构

### 实战环节

#### 设计中心状态

好的，让我们开始用 useReducer + useContext 的组合来重构应用的状态管理。按照状态中心化的原则，我们把整个应用的状态提取到一个全局对象中。初步设计（TypeScript 类型定义）如下：

```
type AppState {
  // 数据指标类别
  key: "cases" | "deaths" | "recovered";

  // 当前国家
  country: string | null;

  // 过去天数
  lastDays: {
    cases: number;
    deaths: number;
    recovered: number;
  }
}
```

#### 在根组件中定义 Reducer 和 Dispatch Context

这一次我们按照**自顶向下**的顺序，先在根组件 `App` 中配置好所有需要的 Reducer 以及 Dispatch 上下文。打开 `src/App.js` ，修改代码如下：

```
// src/App.js
import React, { useReducer } from "react";

// ...

const initialState = {
  key: "cases",
  country: null,
  lastDays: {
    cases: 30,
    deaths: 30,
    recovered: 30,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_KEY":
      return { ...state, key: action.key };
    case "SET_COUNTRY":
      return { ...state, country: action.country };
    case "SET_LASTDAYS":
      return {
        ...state,
        lastDays: { ...state.lastDays, [action.key]: action.days },
      };
    default:
      return state;
  }
}

// 用于传递 dispatch 的 React Context

export const AppDispatch = React.createContext(null);

function App() {

	// 这里传递给子组件的是一个函数，dispatch是一个函数
  const [state, dispatch] = useReducer(reducer, initialState);
  
  
  const { key, country, lastDays } = state;

  const globalStats = useCoronaAPI("/all", {
    initialData: {},
    refetchInterval: 5000,
  });

  const countries = useCoronaAPI(`/countries?sort=${key}`, {
    initialData: [],
    converter: (data) => data.slice(0, 10),
  });

  const history = useCoronaAPI(`/historical/${country}`, {
    initialData: {},
    converter: (data) => data.timeline,
  });

  return (
    <AppDispatch.Provider value={dispatch}>
      <div className='App'>
        <h1>COVID-19</h1>
        <GlobalStats stats={globalStats} />
        <SelectDataKey />
        <CountriesChart data={countries} dataKey={key} />

        {country ? (
          <>
            <h2>History for {country}</h2>
            <HistoryChartGroup history={history} lastDays={lastDays} />
          </>
        ) : (
          <h2>Click on a country to show its history.</h2>
        )}
      </div>
    </AppDispatch.Provider>
  );
}

export default App;
```

我们来一一分析上面的代码变化：

1. 首先定义了整个应用的初始状态 `initialState`，这个是后面 `useReducer` 钩子所需要的
2. 然后我们定义了 Reducer 函数，主要响应三个 Action：`SET_KEY` 、`SET_COUNTRY` 和 `SET_LASTDAYS` ，分别用于修改数据指标、国家和过去天数这三个状态
3. 定义了 `AppDispatch` 这个 Context，用来向子组件传递 `dispatch`
4. 调用 `useReducer` 钩子，获取到状态 `state` 和分发函数 `dispatch`
5. 最后在渲染时用 `AppDispatch.Provider` 将整个应用包裹起来，传入 `dispatch` ，使子组件都能获取得到

#### 在子组件中通过 Dispatch 修改状态

现在子组件的所有状态都已经提取到了根组件中，而子组件唯一要做的就是在响应用户事件时通过 `dispatch` 去修改中心状态。思路非常简单：

- 先通过 `useContext` 获取到 `App` 组件传下来的 `dispatch`
- 调用 `dispatch` ，发起相应的动作（Action）

OK，让我们开始动手吧。打开 `src/components/CountriesChart.js` ，修改代码如下：

```js
// src/components/CountriesChart.js
import React, { useContext } from "react";
// ...
import { AppDispatch } from "../App";

function CountriesChart({ data, dataKey }) {
    
    //dispatch是一个函数
  const dispatch = useContext(AppDispatch);

// 使用const [state, dispatch] = useReducer(reducer, initialState);

  function onClick(payload = {}) {
    if (payload.activeLabel) {
      dispatch({ type: "SET_COUNTRY", country: payload.activeLabel });
    }
  }

  return (
    // ...
  );
}

export default CountriesChart;
```

按照同样的思路，我们来修改 `src/components/HistoryChartGroup.js` 组件：

```
// src/components/HistoryChartGroup.js
import React, { useContext } from "react";

import HistoryChart from "./HistoryChart";
import { transformHistory } from "../utils";
import { AppDispatch } from "../App";

function HistoryChartGroup({ history = {}, lastDays = {} }) {
  const dispatch = useContext(AppDispatch);

  function handleLastDaysChange(e, key) {
    dispatch({ type: "SET_LASTDAYS", key, days: e.target.value });
  }

  return (
    // ...
  );
}

export default HistoryChartGroup;
```

最后一公里，修改 `src/components/SelectDataKey.js` ：

```
// src/components/SelectDataKey.js
import React, { useContext } from "react";
import { AppDispatch } from "../App";

function SelectDataKey() {
  const dispatch = useContext(AppDispatch);

  function onChange(e) {
    dispatch({ type: "SET_KEY", key: e.target.value });
  }

  return (
    // ...
  );
}

export default SelectDataKey;
```

重构完成，把项目跑起来，应该会发现和上一步的功能分毫不差。

> **提示**