import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface Iprops {
  children?: ReactNode
  name: string
  age: number
  height?: number
}

//直接对props进行类型约束 方式一：const Download = (props: Iprops)
//方式二：const Download : React.FunctionCommpent<Iprops> = (props)
// 或者const Download : React.FC<Iprops> = (props)
//  因为是上面导入了React 所以可以直接使用React.FC
const Download: FC<Iprops> = (props: Iprops) => {
  return (
    <div>
      <div>name:{props.name}</div>
      <div>age:{props.age}</div>
      <div>height:{props.height}</div>
      <div>height:{props.children}</div>
    </div>
  )
}

export default memo(Download)
//性能优化（防止不必要的重复渲染）。不加 memo，React 组件默认会像“连体婴”一样：
// 只要父组件更新了，子组件不管自己有没有变，都会跟着无脑重新渲染。
