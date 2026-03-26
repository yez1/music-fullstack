import React, { Suspense, useEffect } from 'react'
import { Link, useRoutes } from 'react-router-dom'
import routes from './router'
import AppHeader from './components/app-header'
import AppFooter from './components/app-footer'
import AppPlayerBar from './views/player/app-player-bar'
import AISidebar from './views/ai-sidebar'
import { fetchCurrentSongAction } from './views/player/store/player'
import { useAppDispatch } from './store'


function App() {

  const dispatch = useAppDispatch()
  useEffect(()=>{
    dispatch(fetchCurrentSongAction(1871479967))
  },[])

  return (
    <div className="App">
      <AppHeader/>
      <Suspense fallback="">
        <div className="main">{useRoutes(routes)}</div>
      </Suspense>
      <AppFooter/>

      <AppPlayerBar/>
      <AISidebar/>
    </div>
  )
}

export default App
