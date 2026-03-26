import React, { Suspense } from 'react'
import { Link, useRoutes } from 'react-router-dom'
import routes from './router'
import {shallowEqual} from 'react-redux'
import { useAppSelector,useAppDispatch,shallowEqualApp } from './store/index'
import { changeMessageAction } from './store/modules/counter'

import {Button} from 'antd'

// import store from './store'
// type GetstateFnType= typeof store.getState;
// type IrootState = ReturnType<GetstateFnType>
function App() {

  const state = useAppSelector((state) => ({
    count: state.counter.count,
    message: state.counter.message
  }),
  shallowEqualApp
)

// 修改message
const dispath = useAppDispatch();
function handlechangeMessage(){
  // 派发action
  // store.dispatch(changeReducer('改变后的message'))
  dispath(changeMessageAction('改变后的message'))
};

  return (
    <div className="App">
      <div>
        <Link to="/discover">发现音乐</Link>
        <Link to="mine">我的音乐</Link>
        <Link to="focus">关注</Link>
        <Link to="download">下载客户端</Link>
      </div>
      <h2>计数： {state.count}</h2>
      <h2>消息： {state.message}</h2>
      <button onClick={handlechangeMessage}>修改消息</button>   
      <Suspense fallback="">
        <div className="main">{useRoutes(routes)}</div>
      </Suspense>

      <Button type="primary">Primary Button</Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
      <Button type="text">Text Button</Button>
      <Button type="link">Link Button</Button>
    </div>

  )
}

export default App
