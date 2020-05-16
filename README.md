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





![微信图片_20200516112919](C:/Users/Artificial/Desktop/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200516112919.gif)

注意以下要点：

1. 在初次渲染时，我们通过 `useState` 定义了多个状态；
2. 每调用一次 `useState` ，都会在组件之外生成一条 Hook 记录，同时包括状态值（用 `useState` 给定的初始值初始化）和修改状态的 Setter 函数；
3. 多次调用 `useState` 生成的 Hook 记录形成了一条**链表**；
4. 触发 `onClick` 回调函数，调用 `setS2` 函数修改 `s2` 的状态，不仅修改了 Hook 记录中的状态值，还即将**触发重渲染**。

OK，重渲染的时候到了，动画如下：![微信图片_20200516112925](C:/Users/Artificial/Desktop/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200516112925.gif)

**提示**

当你充分理解上面两个动画之后，其实就能理解为什么这个 Hook 叫 `useState` 而不是 `createState` 了——之所以叫 `use` ，是因为没有的时候才创建（初次渲染的时候），有的时候就直接读取（重渲染的时候）。

- 状态和修改状态的 Setter 函数两两配对，并且后者一定影响前者，前者只被后者影响，作为一个整体它们完全不受外界的影响
- 鼓励细粒度和扁平化的状态定义和控制，对于代码行为的可预测性和可测试性大有帮助
- 除了 `useState` （和其他钩子），函数组件依然是实现渲染逻辑的“纯”组件，对状态的管理被 Hooks 所封装了起来

###  useEffect 的本质

### ![微信图片_20200516113123](C:/Users/Artificial/Desktop/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200516113123.gif)

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

![微信图片_20200516121614](C:/Users/Artificial/Desktop/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20200516121614.gif)

我们在 `App` 组件中调用了 `useCustomHook` 钩子。可以看到，**即便我们切换到了自定义 Hook 中，Hook 链表的生成依旧没有改变**。再来看看重渲染的情况：

同样地，即便代码的执行进入到自定义 Hook 中，我们依然可以从 Hook 链表中读取到相应的数据，这个”配对“的过程总能成功。

我们再次回味一下 Rules of Hook。它规定只有在两个地方能够使用 React Hook：

1. React 函数组件
2. 自定义 Hook

第一点我们早就清楚了，第二点通过刚才的两个动画相信你也明白了：**自定义 Hook 本质上只是把调用内置 Hook 的过程封装成一个个可以复用的函数，并不影响 Hook 链表的生成和读取**。